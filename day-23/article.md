# [Day23] - 分析 SCSS 的規則

## 前言

day-10 到 day-20 說明了 HTML 文字檔，如何分析

- tokenizer : 將文字轉成 token
- parser : 將 token 轉成 AST
- transformer : 將 AST 進一步處理變成新的 AST (例如說 attrStr -> attrs)
- renderer : 將 AST 轉成 HTML DOM

今天我們進入 CSS 的領域，來看看 SCSS 檔案的規則吧 ~

---

### 註解

- `//` : 單行註解
- `/* */` : 多行註解

### 變數定義

- 利用 `$` 開頭，後面接變數名稱 (例如 `$color`)
- 如果變數名稱有要使用其他變數，則要用 `#{}` 包起來 (例如 `#{$property}: $rtl-value;`)
- `:` 後面接變數的值 (例如 `$color: #fff;`)

變數的值可以是下述類型：

- 數字 Number (例如 `1px`)
- 字串 String (例如 `"hello"`)
- 顏色 Color (例如 `#f2ece4 . rgba(107, 113, 127, 0.8)`)
- 列表 List (例如 `(1px, 2px, 3px)`).
- 數組 Map (例如 `(key1: value1, key2: value2)`)

### 流程控制

- @if / @else / @else if

```scss
// SCSS 樣式
$light-background: #f2ece4;
$light-text: #036;
$dark-background: #6b717f;
$dark-text: #d2e1dd;
$relax-background: #4de6ee;
$relax-text: #36a1a6;

@mixin theme-colors($theme: 'light') {
  @if $theme == 'light' {
    background-color: $light-background;
    color: $light-text;
  } @else if $theme == 'dark' {
    background-color: $dark-background;
    color: $dark-text;
  } @else {
    background-color: $relax-background;
    color: $relax-text;
  }
}

.banner {
  @include theme-colors($theme: 'light');

  body.dark & {
    @include theme-colors($theme: 'dark');
  }

  body.relax & {
    @include theme-colors($theme: 'relax');
  }
}

// 轉換後的 CSS 樣式
.banner {
  background-color: #f2ece4;
  color: #036;
}

body.dark .banner {
  background-color: #6b717f;
  color: #d2e1dd;
}

body.relax .banner {
  background-color: #4de6ee;
  color: #36a1a6;
}
```

- @each

```scss
// SCSS 樣式
$sizes: 40px, 50px, 80px;

@each $size in $sizes {
  .icon-#{$size} {
    font-size: $size;
    height: $size;
    width: $size;
  }
}

// 轉換後的 CSS 樣式
.icon-40px {
  font-size: 40px;
  height: 40px;
  width: 40px;
}

.icon-50px {
  font-size: 50px;
  height: 50px;
  width: 50px;
}

.icon-80px {
  font-size: 80px;
  height: 80px;
  width: 80px;
}
```

- [@for](https://sass-lang.com/documentation/at-rules/control/for) 

```scss
// SCSS 樣式
@for $i from 1 through 3 {
  ul:nth-child(3n + #{$i}) {
    background-color: lighten($base-color, $i * 5%);
  }
}

// 轉換後的 CSS 樣式
ul:nth-child(3n + 1) {
  background-color: #004080;
}

ul:nth-child(3n + 2) {
  background-color: #004d99;
}

ul:nth-child(3n + 3) {
  background-color: #0059b3;
}
```

- [@while](https://sass-lang.com/documentation/at-rules/control/while)

```scss
// SCSS 樣式
@use "sass:math";

/// Divides `$value` by `$ratio` until it's below `$base`.
@function scale-below($value, $base, $ratio: 1.618) {
  @while $value > $base {
    $value: math.div($value, $ratio);
  }
  @return $value;
}

$normal-font-size: 16px;
sup {
  font-size: scale-below(20px, 16px); 
}

// 轉換後的 CSS 樣式
sup {
  font-size: 12.36094px;
}
```

### 輸出訊息

- @error
- @warn
- @debug

```scss
// SCSS 
@debug "Debugging";  // 執行時會輸出訊息 "src\app.scss:6 Debug: Debugging"
@warn "This is a warning";   // 執行時會輸出訊息 "Warning: This is a warning \n src\app.scss 7:1  root stylesheet"
@error "error happened";  // 執行時會輸出訊息 "sass.Exception [Error]: "error happened"" 並中斷編譯的執行
```

![all-info](https://raw.githubusercontent.com/andrew781026/ithome_ironman_2022/main/day-23/all-info.png)


### 引入其他檔案

- @use  : 引入其他檔案的內容定使用 namespace 區隔，必須放在其它指令 @keyword 之前 (例如 `@use "other.scss" as c;`)
- @forward : 可在主檔中使用其他檔案的變數，沒使用到的變數，css output 不顯示
- @import : 引入其他檔案的內容 (例如 `@import "other.scss";`)

### 區塊重用

- @function : 定義函式，並回傳值 

```scss
// SCSS 樣式
@function pow($base, $exponent) {
  $result: 1;
  @for $_ from 1 through $exponent {
    $result: $result * $base;
  }
  @return $result;
}

.sidebar {
  float: left;
  margin-left: pow(4, 3) * 1px;
}

// 轉換後的 CSS 樣式
.sidebar {
  float: left;
  margin-left: 64px;
}
```

- %placeholder / @extend : %placeholder 定義區塊重用的樣式，並在需要使用的地方使用 @extend

```scss
// SCSS 樣式
%toolbelt {
  box-sizing: border-box;
  border-top: 1px rgba(#000, .12) solid;
  padding: 16px 0;
  width: 100%;

  &:hover { border: 2px rgba(#000, .5) solid; }
}

.action-buttons {
  @extend %toolbelt;
  color: #4285f4;
}

// 轉換後的 CSS 樣式
.action-buttons {
  box-sizing: border-box;
  border-top: 1px rgba(0, 0, 0, 0.12) solid;
  padding: 16px 0;
  width: 100%;
  color: #4285f4;
}
.action-buttons:hover {
  border: 2px rgba(0, 0, 0, 0.5) solid;
}
```

- @mixin / @include : @mixin 定義區塊重用的樣式，並在需要使用的地方使用 @include

```scss
// SCSS 樣式
@mixin reset-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

@mixin horizontal-list {
  @include reset-list;

  li {
    display: inline-block;
    margin: {
      left: -2px;
      right: 2em;
    }
  }
}

nav ul {
  @include horizontal-list;
}

// 轉換後的 CSS 樣式
nav ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
nav ul li {
  display: inline-block;
  margin-left: -2px;
  margin-right: 2em;
}
```

### 槽狀結構

```scss
// SCSS 樣式
nav {
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li { display: inline-block; }

  a {
    display: block;
    padding: 6px 12px;
    text-decoration: none;
  }
}

// 轉換後的 CSS 樣式
nav ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
nav li {
  display: inline-block;
}
nav a {
  display: block;
  padding: 6px 12px;
  text-decoration: none;
}
```

### From CSS

- @media : 檢查視窗大小，顯示對應樣式
- @supports : 檢查瀏覽器是否支援某個 CSS 屬性
- @keyframes : 用來定義動畫
- @font-face : 設定字型

----

統整以上的規則，我們可以得到下面的特殊字元：

- `//` : 單行註解
- `/* */` : 多行註解
- `$` : 變數定義，後面的文字到 `:` 為止，可以當作變數名稱
- `%` : 佔位符選擇器，後面的文字到 `{` 為止，可以當作選擇器名稱
- `:` : 變數的值，後面的字到 `;` 為止，可以當作變數的值 (例如 `:root { --color: #fff; }` 例外)
- `;` : 結尾符號，用於分割兩個定義 (例如 `@import '_color.scss';@import '_button.scss';`)
- `@` : 流程控制、輸出訊息、引入其他檔案、區塊重用、槽狀結構、From CSS ( @ 到 空格 為止，當作關鍵字，@else if 例外)
- `#` : 做變數名稱的組合 (例如 `#{$property}` . `.icon-#{$name}` . `$theme-color-#{warning}`)
- `{` : 一個槽狀區塊的開頭
- `}` : 一個槽狀區塊的結尾

----

今天在 @debug . @warn . @error 區塊可以看到，他們對應的行號，明天我們來說明在多檔案時，我們要如何來做讀取？

### 參考資料

- [sass 文件](https://sass-lang.com/documentation/)

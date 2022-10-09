# [Day24] - source-map 在多檔案中知道程式錯誤的位置 

## 前言

什麼是 source-map？為什麼要使用 source-map？這篇文章就來介紹一下。

當我們使用 dart-sass 編譯 scss 檔案時，除了會輸出 output.css 檔案外，還會輸出 output.css.map 檔案，這個檔案就是 source-map 檔案。

```
{
  "version": 3,
  "sourceRoot": "",
  "sources": ["../src/app.scss"],
  "names": [],
  "mappings": "AAIA;AAAA;AAAA;AAAA;AAAA;AAyBA;EAjBE;EACA;EACA;;AAMA;EACE;EAEE;EACA;;;AAWN;EACE;;;AAGF;EAEE;;;AAEF;AAAA;AAAA;AAAA;;AAAA;AAAA;AAAA;AAAA;AAaE;EACE;EACA;EACA;;AAGF;EAAK;;AAEL;EACE;EACA;EACA;;AAIF;EACE;EACA;;;AAKJ;EACE;EACA;EACA;EACA;;AAEA;EAAU;;;AAGZ;EAEE;;;AAGF;EAEE;;;AAEF;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;;AAAA;AAAA;AAAA;;AAAA;AAAA;AAAA;AAAA",
  "file": "output.css"
}
```

- version：source map 的版本，目前為 3。
- sourceRoot：編譯前的文件的根目錄。
- sources：編譯前的文件名稱，是一個 array，因為很多時候你會將多個檔案編譯到一個。
- names：編譯前的變數。可能不是必要欄位，所以大多都是空的。
- mappings：source map 的主要資訊，是一連串編碼，用來表示原始碼與編譯後程式碼的對應訊息。
- file：編譯後的文件名稱。

### mappings 欄位

1.用分號 ; 區隔編譯後程式碼的行，所以第一個分號前的編碼，對應編譯後程式碼的第一行。以上面例子來看，AAIA;AAAA;AAAA;AAAA;AAAA; 就是對應編譯後程式碼第一行的編碼。

2.用 Base64 VLQ 的編碼，解碼後可以得到編譯前原始碼的位置。


![vlq-info](https://raw.githubusercontent.com/andrew781026/ithome_ironman_2022/main/day-24/vlq-info.png)

### 參考資料

- [Source Map Revision 3 Proposal](https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit)
- [Source map 運作原理](https://blog.techbridge.cc/2021/03/28/how-source-map-works/)
- [Rich-Harris/vlq](https://github.com/Rich-Harris/vlq)

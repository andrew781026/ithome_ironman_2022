# [Day03] - .env 規則說明與解析準備

```
工欲善其事，必先了解規則
```

讓我們先熟悉一下 , .env 有哪些規則吧 ![/images/emoticon/emoticon75.gif](/images/emoticon/emoticon75.gif)

----

## .env Format Rules

### 1. 參數 ( = 前面是 key , 後面是 value )

```properties
S3_BUCKET="YOURS3BUCKET"
SECRET_KEY="YOURSECRETKEYGOESHERE"
```

### 2. 多行 ( 用 "" 包住多行文字 , 當作值是多行內容 )

```properties
PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
...
Kh9NV...
...
-----END RSA PRIVATE KEY-----"
```

### 3. 註解 ( # 後面的文字全部無視 )

```properties
# This is a comment
SECRET_KEY=YOURSECRETKEYGOESHERE # comment
SECRET_HASH="something-with-a-#-hash"
``` 

---

我們分析上方 3 條規則發現可以整理成以下的規律

1. 以 `=` 作為分隔符號 , 前面當變數 , 後面當值
2. 遇到 `#` 後面就全是註解 , 後面不用解析 , 直接換下一行做解析
3. `"` 是一對的 , 不受換行影響
4. 在 `"` 裡面的 `#` 不會被當作註解 , 而是當作一般的字元

---

如果將所有規則整理起來 , 就可以形成下面的 .env-sample 檔案

```properties
# .env-sample file
# This is a comment
SECRET_KEY=YOURSECRETKEYGOESHERE # comment
SECRET_HASH="something-with-a-#-hash"
PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
...
Kh9NV...
...
#### 5678
-----END RSA PRIVATE KEY-----"
``` 

---

明天我們就用這 4 個規則 ,  來手做一個 Parser 解析 .env-sample 檔案吧 ~ 

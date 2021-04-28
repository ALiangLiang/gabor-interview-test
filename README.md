# Gabor Take home 試題

## 初始化資料庫

```sh
NODE_ENV=development DEBUG=gabor-interview-test2:* \
  npx sequelize-cli db:migrate:undo:all && \
  npx sequelize-cli db:migrate && \
  npx sequelize-cli db:seed:all
```

## 啟動

```sh
NODE_ENV=development DEBUG=gabor-interview-test2:* \
  npm start
```

## 頁面

GET / 首頁，使用者列表
GET /profile 個人檔案
GET /account/login 登入
GET /account/regist 註冊

## 網站安全機制與說明

採用 Express 框架時，可以透過 `helmet` 套件來加強網站安全性，例如設定 `Content-Security-Policy` 
標頭來避免網站被注入惡意第三方資源，或是資源採用不安全的寫法。或是隱藏 `X-Powered-By` 
標頭來加強被得知使用的技術的難度，

### XSS

只要是表單送出的部分，都會經過 `sanitize-html` 套件將所有 HTML 標籤篩掉，才會進到資料庫，
避免使用者將惡意程式碼透過 XSS 帶入首頁的用戶清單中。也不能將使用者給的資料直接使用在頁面中。

### SQL 注入

基本上 ORM 在做 SQL 語句的建構時，就會對參數進行字元跳脫，除非是用 ORM 工具進行 raw query，才較有可能讓開發人員疏忽產生漏洞。

### CSRF

有些網站可能會誘騙使用者觸發對受害網站的請求，且該請求有可能夾帶使用者的 cookie，所以讓使用者在發生請求時，
得夾帶只有在從該網站存取時才會產生的 token。透過 `csurf` 套件，會在每個 session 中加上 `csrfSecret`，
當使用者以該 session 請求 CSRF token 時，會以該 secret 來建立屬於他的 token，在使用者做資料的 Request 時，
夾帶它變可讓伺服器可以辨識。

# Cookie / Session

Cookie 一個安全隱憂就是沒有設定好 domain 與 path，倘若今天有許多網站共用一個網域，A 網站未設定好 Cookie 
的 path，這樣就會導致同網域底下不同 path 的網站可以存取到它，並以它盜取 A 網站的使用者身分。


# 💃 **움직여 Zoo!** 
<!-- 사진필요 -->

## 😎 개요

  팀명: **소통의 정원**  
  서비스명: **움직여 Zoo!**  
  개발기간: **2024년 1월 8일 ~ 2월 16일 (7주)**

<br/>

## 🌱 소통의 정원 팀원 🌱
|<img src="" width="100%" height="100">|<img src="" width="100%" height="100">|<img title="" src="" width="100%" height="100">|<img src="" width="100%" height="100">|<img src="" width="100%" height="100">|<img src="" width="100%" height="100">|
|:--:|:--:|:--:|:--:|:--:|:--:|
|<a href="">위재원</a>|<a href="">김창희</a>|<a href="">이현민</a>|<a href="">신현기</a>|<a href="">정세진</a>|<a href="">최용훈</a>
|Backend|Backend CI/CD|Frontend|Frontend|Frontend|Frontend|
|UI/UX 기획 및 설계<br>Unity Asset 제작<br>애니메이션 구현|UI/UX 기획 및 설계<br>Unity Asset 제작<br>애니메이션 구현<br>디버깅 및 리팩토링|UI/UX 기획 및 설계<br>Unity Asset 제작<br>DB 및 API 설계<br>디버깅 및 리팩토링|UI/UX 기획 및 설계<br>Unity Asset 제작<br>DB 설계 및 API 개발<br>CI/CD 구축|AR 강아지 이동 구현<br>AR 돌발 이벤트 구현<br>GPS 활용 기능 구현<br>가속도계 활용 기능 <br>구현|AR 애니메이션 구현<br>AR 유지보수성 향상<br>3D Asset<br>커스터마이징<br>UCC 총괄제작|

<br/>

<br/>


## 🤔 기획의도


<br/>

## 🎇 서비스 소개


<br/>

## 💞 기능 상세

### 1. 메인 페이지
### 2. 로비 페이지
### 3. 싱글 플레이
### 4. 멀티 플레이

<br/>


## ⚙ 사용 기술

#### **FE**

<img src="https://img.shields.io/badge/vs code-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white">
<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=black">
<img src="https://img.shields.io/badge/WebRTC-333333?style=for-the-badge&logo=webrtc&logoColor=white">
<img src="https://img.shields.io/badge/TensorFlow.js-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white">
<img src="https://img.shields.io/badge/java script-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
<img src="https://img.shields.io/badge/recoil-3578E5?style=for-the-badge&logo=recoil&logoColor=white">
<img src="https://img.shields.io/badge/css3-1572B6?style=for-the-badge&logo=css3&logoColor=white">
<img src="https://img.shields.io/badge/tailwind css-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white">
<img src="https://img.shields.io/badge/axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white">

#### **BE**

<img src="https://img.shields.io/badge/Intellij Idea-000000?style=for-the-badge&logo=intellijidea&logoColor=white">
<img src="https://img.shields.io/badge/spring security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white">
<img src="https://img.shields.io/badge/Spring boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white">
<img src="https://img.shields.io/badge/gradle-02303A?style=for-the-badge&logo=gradle&logoColor=white">
<img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white">
<img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white">
<img src="https://img.shields.io/badge/Amazon EC2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white">

#### **CI/CD**

<img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white">
<img src="https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=jenkins&logoColor=white"/> 
<img src="https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white"/>
<img src="https://img.shields.io/badge/openssl-721412?style=for-the-badge&logo=openssl&logoColor=white"> 

#### **협업**

<img src="https://img.shields.io/badge/GitLab-FC6D26?style=for-the-badge&logo=gitlab&logoColor=white">
<img src="https://img.shields.io/badge/Jira-0052CC?style=for-the-badge&logo=jirasoftware&logoColor=white">
<img src="https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white">
<img src="https://img.shields.io/badge/mattermost-0058CC?style=for-the-badge&logo=mattermost&logoColor=white">


<br/>
<br/>

## 🧱 서비스 아키텍쳐

![배포아키텍쳐](./Docs/README_assets/아키텍처.png)
<br/>

## 📁 프로젝트 구조

### **Backend**
<details><summary>펼치기 / 접기</summary>

```
backend
├─main
│  ├─java
│  │  └─com
│  │      └─ssafy
│  │          └─movezoo
│  │              ├─auth
│  │              │  ├─config
│  │              │  │  └─details
│  │              │  ├─controller
│  │              │  ├─dto
│  │              │  ├─sevice
│  │              │  └─util
│  │              ├─friendship
│  │              │  ├─controller
│  │              │  ├─domain
│  │              │  ├─dto
│  │              │  ├─repository
│  │              │  └─service
│  │              ├─game
│  │              │  ├─controller
│  │              │  ├─domain
│  │              │  ├─dto
│  │              │  ├─repository
│  │              │  └─serivce
│  │              ├─global
│  │              │  ├─config
│  │              │  ├─dto
│  │              │  ├─entity
│  │              │  └─init
│  │              ├─openvidu
│  │              │  ├─controller
│  │              │  └─dto
│  │              └─user
│  │                  ├─controller
│  │                  ├─domain
│  │                  ├─dto
│  │                  ├─repository
│  │                  └─sevice
│  └─resources
└─test
    └─java
        └─com
            └─ssafy
                └─movezoo



```
</details>

<br/>

### **FrontEnd**
<details><summary>펼치기 / 접기</summary>  

```
movezoo
├─ .gitignore
├─ jsconfig.json
├─ package-lock.json
├─ package.json
├─ README.md
├─ src
│  ├─ App.js
│  ├─ components
│  │  ├─ home
│  │  │  ├─ GoogleLogin.css
│  │  │  ├─ GoogleLoginButton.js
│  │  │  ├─ Loading.js
│  │  │  ├─ Login.css
│  │  │  ├─ Login.js
│  │  │  ├─ Setpassword.js
│  │  │  ├─ Signup.css
│  │  │  └─ Signup.jsx
│  │  ├─ main
│  │  │  ├─ carousel
│  │  │  │  ├─ Carousel.css
│  │  │  │  └─ Carousel.js
│  │  │  └─ profile
│  │  │     ├─ imagechange
│  │  │     │  ├─ ImageChange.css
│  │  │     │  └─ ImageChange.js
│  │  │     ├─ logout
│  │  │     │  ├─ Logout.css
│  │  │     │  └─ Logout.js
│  │  │     ├─ nicknamechange
│  │  │     │  ├─ NicknameChange.css
│  │  │     │  └─ NicknameChange.js
│  │  │     ├─ passwordchange
│  │  │     │  ├─ PasswordChange.css
│  │  │     │  └─ PasswordChange.js
│  │  │     ├─ Profile.css
│  │  │     └─ Profile.js
│  │  ├─ multi
│  │  │  ├─ Back.js
│  │  │  ├─ Back.module.css
│  │  │  ├─ Chat.js
│  │  │  ├─ Chat.module.css
│  │  │  ├─ Map.js
│  │  │  ├─ Map.module.css
│  │  │  ├─ Ready.js
│  │  │  └─ Ready.module.css
│  │  ├─ navbar
│  │  │  ├─ friend
│  │  │  │  ├─ Friend.css
│  │  │  │  └─ Friend.js
│  │  │  ├─ Navbar.css
│  │  │  ├─ Navbar.js
│  │  │  ├─ ranking
│  │  │  │  ├─ Ranking.css
│  │  │  │  └─ Ranking.js
│  │  │  ├─ setting
│  │  │  │  ├─ Setting.css
│  │  │  │  └─ Setting.js
│  │  │  └─ shop
│  │  │     ├─ character
│  │  │     │  ├─ black.png
│  │  │     │  ├─ Character.css
│  │  │     │  └─ Character.js
│  │  │     ├─ Shop.css
│  │  │     └─ Shop.js
│  │  ├─ play
│  │  │  ├─ Cam.css
│  │  │  ├─ Cam.js
│  │  │  ├─ common.js
│  │  │  ├─ data.js
│  │  │  ├─ gameConstants.js
│  │  │  ├─ Main.js
│  │  │  ├─ MyOvVideo.js
│  │  │  ├─ MyOvVideo____.js
│  │  │  ├─ MyVideoComponent.js
│  │  │  ├─ registerServiceWorker.js
│  │  │  ├─ reportWebVitals.js
│  │  │  ├─ stats.js
│  │  │  ├─ UserOvVideo.js
│  │  │  ├─ UserVideo.css
│  │  │  ├─ UserVideoComponent.js
│  │  │  └─ utilities.js
│  │  ├─ room
│  │  │  ├─ Makeroom.css
│  │  │  └─ Makeroom.js
│  │  └─ single
│  │     ├─ Back.js
│  │     ├─ Back.module.css
│  │     ├─ game
│  │     │  ├─ Back.js
│  │     │  └─ Back.module.css
│  │     ├─ Map1.js
│  │     ├─ Map2.js
│  │     ├─ Map2.module.css
│  │     ├─ result
│  │     │  ├─ Back.js
│  │     │  ├─ Back.module.css
│  │     │  ├─ Record.js
│  │     │  └─ Record.module.css
│  │     ├─ Start.js
│  │     └─ Start.module.css
│  ├─ index.css
│  ├─ index.js
│  └─ pages
│     ├─ home
│     │  ├─ Home.css
│     │  └─ Home.jsx
│     ├─ main
│     │  ├─ Main.css
│     │  └─ Main.js
│     ├─ multi
│     │  ├─ game
│     │  │  ├─ MultiGame.js
│     │  │  └─ MultiGame.module.css
│     │  ├─ Multi.js
│     │  ├─ Multi.module.css
│     │  └─ result
│     │     ├─ MultiResult.js
│     │     └─ MultiResult.module.css
│     ├─ room
│     │  ├─ Room.css
│     │  └─ Room.js
│     └─ single
│        ├─ game
│        │  ├─ Game.js
│        │  └─ Game.module.css
│        ├─ result
│        │  ├─ Result.js
│        │  └─ Result.module.css
│        ├─ Single.js
│        └─ Single.module.css
└─ tailwind.config.js

```
</details>

<br/>

## 📊 ERD

![ERD](./Docs/README_assets/ERD.png)

<br/>

## 💬 API 명세서

![API명세서](./Docs/API명세서.pdf)

<br/>

<!-- ## 🖼️ 와이어프레임 -->
<!-- ![와이어프레임](README_assets/20_와이어프레임.png) -->
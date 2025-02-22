## 실행 방법

1. git clone을 통해 프로젝트를 다운받습니다.

2. 다운받은 폴더를 IDE로 실행합니다.

3. 터미널에 아래의 명령어로 의존성 설치를 합니다.

```
npm install
```

4. 프로젝트의 음악 재생 및 정상적인 동작을 위해 루트 경로에 .env 파일을 만들어야합니다.

```
//.env
VITE_SUPABASE_URL={my-key}
VITE_SUPABASE_ANON_KEY={my-key}

VITE_SPOTIFY_CLIENT_ID={my-key}
VITE_SPOTIFY_CLIENT_SECRET={my-key}

VITE_YOUTUBE_API_KEY={my-key}
```

{my-key}에 자신의 api key를 넣어줍니다. supabase, spotify, youtube의 api key가 필요합니다.

5. 터미널에 아래의 명령어를 입력하여 실행합니다.

```
npm run dev
```

# 나만의 뮤직 웹 Honey

<img width="1280" alt="배포 home" src="https://github.com/user-attachments/assets/0fcfe42d-be9b-4477-aa70-d4e9c000087f"/>
듣고 싶은 음악을 플레이리스트에 등록해 감상해보세요

## 프로젝트 소개

1. '새로 발매된 앨범' 목록을 통해 최신 노래들을 들을 수 있습니다.
2. 'Honey 플레이리스트'를 통해 주제별로 분류된 플레이리스트를 만나볼 수 있습니다.
3. 아티스트 페이지에는 대표곡, 연관 아티스트를 확인할 수 있습니다.
4. 검색 기능을 통해 원하는 음악을 찾을 수 있습니다.
5. 플레이리스트에 등록하여 나만의 플레이리스트를 만듭니다.

## 기술 스택

<div>
<img  src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=white"/>  
<img  src="https://img.shields.io/badge/vite-646CFF?style=for-the-badge&logo=vite&logoColor=white"/>
<img  src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
<img  src="https://img.shields.io/badge/tailwindcss-06B6D4?style=for-the-badge&logo=tailwindCSS&logoColor=white"/>
<img  src="https://img.shields.io/badge/zustand-black?style=for-the-badge&logo=zustand&logoColor=white"/>
<img  src="https://img.shields.io/badge/supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white"/>
</div>

## 주요 기능

 <table>
    <tr>
      <td align="center">회원가입</td>
      <td align="center">로그인</td>
    </tr>
    <tr>
      <td align="center"><img src="https://github.com/user-attachments/assets/11df9bbb-ab12-403a-8c87-5826b38b7fad" /></td>
      <td align="center"><img src="https://github.com/user-attachments/assets/9561525d-8697-457d-9143-0c469b529a41" /></td>
    </tr>
    <tr>
      <td align="center">새로 발매된 앨범(홈)</td>
      <td align="center">앨범</td>
    </tr>
    <tr>
      <td align="center"><img src="https://github.com/user-attachments/assets/d4ac9a3f-8008-4653-a41e-05aff42e248b" /></td>
      <td align="center"><img src="https://github.com/user-attachments/assets/6c3cb6b0-d72e-4890-80b3-1f3c38faacc8" /></td>
    </tr>
    <tr>
      <td align="center">아티스트</td>
      <td align="center">Honey 플레이리스트</td>
    </tr>
    <tr>
      <td align="center"><img src="https://github.com/user-attachments/assets/14a4fe29-7a86-48df-84a4-c66faac0afb5" /></td>
      <td align="center"><img src="https://github.com/user-attachments/assets/d987dfa6-b695-41b3-9605-9a20c286084a" /></td>
    </tr>
    <tr>
      <td align="center">검색</td>
      <td align="center">플레이리스트</td>
    </tr>
    <tr>
      <td align="center"><img src="https://github.com/user-attachments/assets/baa3ec7c-3044-4587-8288-f6fabfd333b3" /></td>
      <td align="center"><img src="https://github.com/user-attachments/assets/8e1fd3c5-1bba-4202-a1cb-9fd5c0c2f4f1" height="200" /></td>
    </tr>
 </table>

### 비로그인

비로그인시에도 음악 듣기 및 플레이리스트 등록이 가능합니다.(로그인했을 때와의 차이점은 로그인을 하면 계정에 따른 플레이리스트를 만들 수 있습니다.)

### 플레이리스트

곡옆에 배치된 ...기호 또는 재생 버튼을 눌러서 플레이리스트에 음악을 등록할 수 있습니다.

## 개발 일지

- [Honey 개발 일지](https://keen-blue-f02.notion.site/Honey-bae4439c30c44725ad8b61d85ccf9c00)

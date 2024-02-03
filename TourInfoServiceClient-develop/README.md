# TourInfoService Client for React

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### 개발 참고 api

- ui deisign \
  daisyui: https://daisyui.com/theme-generator/ \
  tailwindcss: https://tailwindcss.com/docs/installation

- text editor\
  TinyMCE: https://www.tiny.cloud/docs/tinymce/6/react-cloud/

- map api docs \
  naver cloud platform: https://guide.ncloud-docs.com/docs/ko/maps-overview\
  naver map service: https://www.ncloud.com/product/applicationService/maps\
  naver map github: https://navermaps.github.io/maps.js.ncp/docs/tutorial-1-Conceptual-Overview.html\
  React naver maps: https://zeakd.github.io/react-naver-maps/

### git 사용방법

- 규칙

1. master branch에 push 금지
2. pull request를 통하여 master branch로 merge
3. API key, DB 정보 등 보안사항 하드코딩 금지\
   그 외의 사항들은 추후 추가

- 용어 \
  repository: 저장소\
  commit: repository에 저장\
  push: 업로드(로컬 저장소의 commit를 업로드)\
  pull: 다운로드(원격 저장소의 commit를 다운로드)\
  merge: 코드 병합\
  pull request: 병합 요청\
  branch: 갈래\
  origin: 원격 저장소\
  HEAD: 작업중인 branch

- 명령어

* add
  > git add {File Name}
* commit
  > git commit -m {message}"
* checkout
  > git checkout {commit CheckSum or branch Name} \
  > git checkout - => 최신 커밋으로 돌아가기
* clone
  > git clone https://github.com/sb3827/TourInfoServiceClient.git .\
  > .은 현재 위치이므로 원하는 주소로 변경
* push
  > git push {repository} {branch}
* pull
  > git pull
* branch
  > git branch {branch Name}
* merge
  > git merge {target branch}

- request 방법

  github에서 요청

  > base: 병합된 커밋이 들어갈 브랜치\
  > compare: 병합의 대상(병합할 커밋)이 될 브랜치\
  > Able to merge / Conflict 코드 충돌 여부\
  > 제목, 내용 작성\
  > Reviewers 검토자\
  > Assginees request요청자

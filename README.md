# 꿈가락

## 개요
꿈가락 프로젝트는 AI를 활용하여 유아의 선호를 반영한 동요를 만들어보면 개별화된 음악적 경험을 제공하고, 가사 내용에 따른 긍적적인 습관 형성을 지원해주는 프로젝트이다.

## 목차
1. [개요](#개요)
2. [구조 설명](#구조-설명)

## 구조 설명
- **backend**: [Node JS 기반의 서버]
- **[frontend]**: [React Native 기반의 애플리케이션]

## backend api

| 구분   | 설명                  | 메서드 | 경로                        |
|--------|-----------------------|--------|-----------------------------|
| 습관   | 사용자의 습관 목록 보기 | GET    | /api/habit/${userId}        |
| 습관   | 습관 추가 저장        | POST   | /api/habit                  |
| 습관   | 습관 선택 저장        | POST   | /api/habit/toggle           |
| 선호도 | 선호도 저장           | POST   | /api/preferences            |
| 선호도 | 선호도 수동입력       | POST   | /api/preferences/direct     |
| 선호도 | 선호도 정보 보기      | GET    | /api/preferences/${userId}  |
| 선호도 | 선호도 리셋           | POST   | /api/preferences/reset      |
| 가사   | 가사 생성 & 저장      | POST   | /api/lyric                  |
| 가사   | 저장된 가사 보기      | GET    | /api/lyric/${userId}        |
| 멜로디 | 악기 저장             | POST   | /api/instrument             |
| 멜로디 | 악기 보기             | GET    | /api/instrument/${userId}   |
| 노래   | 노래 생성 및 저장     | POST   | /api/song                   |
| 노래   | 노래 들고오기         | GET    | /api/song/${userId}         |
| 노래   | 노래 삭제하기         | POST   | /api/song/delete            |

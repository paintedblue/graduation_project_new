const { createGPTPrompt, callGPTApi } = require('./gptFunctions');
require('dotenv').config({ path: '../../../.env' }); // 환경 변수 사용을 위해 dotenv 모듈 사용

// 환경 변수가 제대로 로드되었는지 확인
console.log('Loaded OPENAI_API_KEY:', process.env.OPENAI_API_KEY);

// 더미 사용자 선호도 데이터
const dummyPreferences = {
  주인공: '토끼',
  성별: '여성',
  나이: '6세',
  좋아하는_것: ['당근', '춤추기'],
  싫어하는_것: ['늑대', '비']
};

// 응답을 JSON 형식으로 파싱하는 함수
const parseGptResponse = (response) => {
  try {
    // 필요한 부분을 추출
    const startIndex = response.indexOf('{');
    const endIndex = response.lastIndexOf('}') + 1;
    const jsonString = response.slice(startIndex, endIndex);

    // JSON으로 파싱
    return JSON.parse(jsonString);
  } catch (error) {
    throw new Error('Failed to parse JSON response: ' + error.message);
  }
};

// 테스트 함수
const testGPTPrompt = async () => {
  try {
    // 프롬프트 생성
    const prompt = createGPTPrompt(dummyPreferences);
    console.log("Generated Prompt:\n", prompt);

    // GPT API 호출
    const gptResponse = await callGPTApi(prompt);

    // 응답 출력
    console.log("GPT Response:\n", gptResponse);

    // 응답을 JSON 형식으로 파싱
    // const responseJson = parseGptResponse(gptResponse);

    // 각 부분을 출력
    // console.log("GPT Response - 제목:", responseJson.제목);
    // console.log("GPT Response - 후렴구:", responseJson.후렴구);
    // console.log("GPT Response - 가사:", responseJson.가사);
  } catch (error) {
    console.error('Error during test:', error.message);
  }
};

// 테스트 실행
testGPTPrompt();

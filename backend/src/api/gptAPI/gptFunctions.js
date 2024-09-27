const axios = require('axios');
require('dotenv').config({ path: '../../../.env' }); 

// 답변 문장에서 키워드 추출 GPT 프롬프트를 생성하는 함수
const createExtractPrompt = (sentence, field) => {
  
  return `
  Task : {
    "문장" : ${sentence}
    "카테고리" : ${field}
    
    문장에서 주어진 카테고리에 맞는 키워드를 하나만 뽑아줘. 
    그리고 그 키워드와 어울리는 색을 하나 #HEX 형식으로 추천해줘. 
    또한, 그 키워드에 맞는 사진의 설명을 작성해줘.
    반드시 정확한 JSON 형식으로 응답해줘.
  
  },
  Output_formation : 
  {
    "keyword" : "",
    "color" : "",
    "image_description" : ""
  }`;
};

// 키워드 추출 GPT API를 호출하는 함수
const extractKeyword = async (sentence, field) => {
  const prompt = createExtractPrompt(sentence, field);
  
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o', 
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 100
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    const gptText = response.data.choices[0].message.content.trim();

    // 응답이 JSON 형식인지 검증
    if (gptText.startsWith('{') && gptText.endsWith('}')) {
      // 응답이 JSON 형식이면 파싱
      return JSON.parse(gptText);
    } else {
      // 응답이 JSON 형식이 아닐 경우 처리
      console.error('GPT API 응답이 JSON이 아닙니다:', gptText);
      throw new Error('GPT did not return valid JSON');
    }

  } catch (error) {
    console.error('Error calling GPT API:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// 답변 문장에서 키워드 추출 GPT 프롬프트를 생성하는 함수
const createDirectPrompt = (value, field) => {
  
  return `
  Task : {
    "키워드" : ${value}
    "카테고리" : ${field}
    
    키워드는 ${value} 그대로 사용하고, 이 키워드와 어울리는 색을 하나 #HEX 형식으로 추천해줘. 
    또한, 키워드에 맞는 사진의 설명을 작성해줘.
    반드시 정확한 JSON 형식으로 응답해줘.
  
  },
  Output_formation : 
  {
    "keyword" : ,
    "color" : ,
    "image_description" : 
  }`;
};

// 키워드 추출 GPT API를 호출하는 함수
const directKeyword = async (value, field) => {
  const prompt = createDirectPrompt(value, field);
  // console.log(prompt);
  
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4', 
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 100
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    const gptText = response.data.choices[0].message.content.trim();
    // console.log(gptText);

    // 응답이 JSON 형식인지 검증
    if (gptText.startsWith('{') && gptText.endsWith('}')) {
      // 응답이 JSON 형식이면 파싱
      return JSON.parse(gptText);
    } else {
      // 응답이 JSON 형식이 아닐 경우 처리
      console.error('GPT API 응답이 JSON이 아닙니다:', gptText);
      throw new Error('GPT did not return valid JSON');
    }

  } catch (error) {
    console.error('Error calling GPT API:', error.response ? error.response.data : error.message);
    throw error;
  }
};


// 가사 생성 GPT 프롬프트를 생성하는 함수
const createGPTPrompt = (userInfo) => {
  const { userId, likeAnimalOrCharacter, likeColor, likeFood, habits } = userInfo;

  // 선택된 습관들만 필터링
  const selectedHabits = habits && habits.length > 0
    ? habits.filter(habit => habit.selected).map(habit => habit.name).join(', ') : '습관이 없습니다';

  // 필수 데이터가 없을 경우 공백 또는 기본값으로 처리
  const animalCharacterKeyword = likeAnimalOrCharacter && likeAnimalOrCharacter.keyword
    ? likeAnimalOrCharacter.keyword : "";

  const colorKeyword = likeColor && likeColor.keyword
    ? likeColor.keyword : "";

  const foodKeyword = likeFood && likeFood.keyword
    ? likeFood.keyword : "";

  return `
  너는 아이들을 위한 동요 작가이다. 다음 정보를 바탕으로, 5~7세 아이들이 이해하기 쉬운 짧은 동요 가사를 만들어.

  1. 동물 또는 캐릭터: ${animalCharacterKeyword}
  2. 색깔: ${colorKeyword}
  3. 음식: ${foodKeyword}
  4. 습관: ${selectedHabits}

  동물 또는 캐릭터(${animalCharacterKeyword})와 '나'가 주인공이며, 이 캐릭터가 ${selectedHabits}을 즐거워하며 수행하는 내용을 가사에 포함해.
  가사에 좋아하는 색깔(${colorKeyword})이나 음식(${foodKeyword})은 선택적으로 사용해.
  가사는 유아의 상상력을 자극하고, 쉬운 단어를 사용해 4줄로 구성해. 
  흥미를 끌 수 있도록 의성어와 의태어도 적절히 사용해.

  최종 출력 형식:
  {
    "title": "~~",
    "lyric": "~~~~~~"
  }
  `;
  // return `
  // Task :
  // [
  // "주어진 정보를 바탕으로 동요 가사 만들어 줘"
  // ],
  // Task_Rule :
  // [
  // "5~7세 수준의 쉬운 단어를 사용해.",
  // "가사는 네 소절 이내로 구성해.",
  // "Person_info의 좋아하는 동물 또는 캐릭터가 Person_info의 습관을 수행하는 내용을 논리적으로 진행해.",
  // "Person_info 키워드들과 연결하여 가사 내용을 만들어.",
  // "유아의 호기심과 상상력을 불러일으키고 흥미를 자극할 수 있도록 만들어.",
  // "내용에 적절한 의성어나 의태어를 사용해.",
  // "내용을 1인칭 시점으로, '나'가 들어가게 해.",
  // ],
  // Person_info:
  // [
  // "좋아하는 동물 또는 캐릭터": "${animalCharacterKeyword}",
  // "좋아하는 색깔": "${colorKeyword}",
  // "좋아하는 음식": "${foodKeyword}",
  // "습관": "${selectedHabits ? selectedHabits : '습관이 없습니다'}"
  // ]
  // Output_formation:
  // Json 형식으로
  // {
  // "title" : "~~",
  // "lyric" : "~~~~~~"
  // }
  // `;
};

// 가사 생성 GPT API를 호출하는 함수
const callGPTApi = async (prompt) => {
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error calling GPT API:', error.response ? error.response.data : error.message);
    throw error;
  }
};

module.exports = {
  directKeyword,
  extractKeyword,
  createGPTPrompt,
  callGPTApi
};

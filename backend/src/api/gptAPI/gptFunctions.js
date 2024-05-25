const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config({ path: '../../../.env' }); 

// 답변 문장에서 키워드 추출 GPT 프롬프트를 생성하는 함수
const createExtractPrompt = (sentence) => {
  return `Extract the main keyword that best represents a preference from the following sentence in Korean: "${sentence}"`;
};

// 키워드 추출 GPT API를 호출하는 함수
const extractKeyword = async (sentence) => {
  
  const prompt = createExtractPrompt(sentence);
  
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4', 
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 20
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data.choices[0].message.content;  // 응답에서 키워드 추출
  } catch (error) {
    console.error('Error calling GPT API:', error.response ? error.response.data : error.message);
    throw error;
  }
};


// 가사 생성 GPT 프롬프트를 생성하는 함수
const createGPTPrompt = (userInfo) => {
  const { mainCharacter, likeColor, likeThing, habit } = userInfo;

  return `
  Task :
  [
  "주어진 정보를 바탕으로 동요 가사 만들어 줘"
  ],
  Task_Rule :
  [
    "5~7세 수준의 쉬운 단어를 사용해.",
    "가사는 네 소절 이내로 구성해줘.",
    "습관을 고칠 수 있도록 좋아하는 것과 좋아하는 색과 연결하여 가사 내용을 만들어줘",
    "습관이 없다면 그냥 좋아하는 것, 좋아하는 색으로 가사 내용을 만들어 줘.",
    ”논리적으로 가사 내용이 진행되도록 작성해줘.",
    "유아의 호기심과 상상력을 불러일으키고 흥미를 자극할 수 있도록 만들어 줘.",
    "내용에 적절한 의성어나 의태어를 사용해 줘.",
    "내용을 1인칭 시점으로, '나'가 들어가게 해줘."
    ],
  Person_info:
  [
  "주인공": "${mainCharacter}",
  "좋아하는 색깔": "${likeColor}",
  "좋아하는 것": "${likeThing}",
  "습관": "${habit}"
  ]
  Output_formation:
  [
  "Json 형식으로 제목, 후렴구로 만들어"
  ]
  `;
};

// 가사 생성 GPT API를 호출하는 함수
const callGPTApi = async (prompt) => {
    // console.log(`Bearer ${process.env.OPENAI_API_KEY}`)
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    throw new Error('Error generating song lyrics: ' + error.message);
  }
};



module.exports = {
  createExtractPrompt,
  extractKeyword,
  createGPTPrompt,
  callGPTApi
};

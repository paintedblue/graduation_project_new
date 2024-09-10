const axios = require('axios');
require('dotenv').config({ path: '../../../.env' }); 

// 답변 문장에서 키워드 추출 GPT 프롬프트를 생성하는 함수
const createExtractPrompt = (sentence, field) => {
  return `
  Task : 
  {
    다음 문장에서 주어진 카테고리(${field})에 맞는 키워드를 하나만 뽑아줘. 
    그리고 그 키워드와 어울리는 색을 하나 #HEX 형식으로 추천해줘. 
    또한, 그 키워드에 맞는 사진의 설명을 작성해줘.
    반드시 정확한 JSON 형식으로 응답해줘.
  }
  Info :
  {
  "문장" : ${sentence}
  "주제" : ${field}
  }
  Output_formation : 
  {
    "keyword" : "추출된 키워드",
    "color" : "#HEX 형식의 색상 코드",
    "image_description" : "키워드에 맞는 사진의 설명"
  }`;
};

// 키워드 추출 GPT API를 호출하는 함수
const extractKeyword = async (sentence, field) => {
  const prompt = createExtractPrompt(sentence, field);
  
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
    
    // GPT 응답에서 필요한 정보 추출
    const { keyword, color, image_description } = JSON.parse(response.data.choices[0].message.content);

    return { keyword, color, image_description };

  } catch (error) {
    console.error('Error calling GPT API:', error.response ? error.response.data : error.message);
    throw error;
  }
};


// 가사 생성 GPT 프롬프트를 생성하는 함수
const createGPTPrompt = (userInfo) => {
  const { userId, likeAnimal, likeCharacter, likeColor, likeFood, habits } = userInfo;

  // 선택된 습관들만 필터링
  const selectedHabits = habits
    ? habits.filter(habit => habit.selected).map(habit => habit.name).join(', ')
    : '';

  // 필수 데이터가 없을 경우 공백으로 처리
  const animalKeyword = likeAnimal ? likeAnimal.keyword : "";
  const characterKeyword = likeCharacter ? likeCharacter.keyword : "";
  const colorKeyword = likeColor ? likeColor.keyword : "";
  const foodKeyword = likeFood ? likeFood.keyword : "";


  return `
  Task :
  [
  "주어진 정보를 바탕으로 동요 가사 만들어 줘"
  ],
  Task_Rule :
  [
  "5~7세 수준의 쉬운 단어를 사용해.",
  "가사는 네 소절 이내로 구성해줘.",
  "습관을 고칠 수 있도록 주어지는 Person_info 키워드들과 연결하여 가사 내용을 만들어줘",
  "습관이 없다면 그냥 Person_info 키워드들로 가사 내용을 만들어 줘.",
  ”논리적으로 가사 내용이 진행되도록 작성해줘.",
  "유아의 호기심과 상상력을 불러일으키고 흥미를 자극할 수 있도록 만들어 줘.",
  "내용에 적절한 의성어나 의태어를 사용해 줘.",
  "내용을 1인칭 시점으로, '나'가 들어가게 해줘.",
  ],
  Person_info:
  [
  "좋아하는 동물": "${animalKeyword}",
  "좋아하는 캐릭터": "${characterKeyword}",
  "좋아하는 색깔": "${colorKeyword}",
  "좋아하는 음식": "${foodKeyword}",
  "습관": "${selectedHabits ? selectedHabits : '습관이 없습니다'}"
  ]
  Output_formation:
  Json 형식으로
  {
  "title" : "~~",
  "lyric" : "~~~~~~"
  }
  `;
};

// 가사 생성 GPT API를 호출하는 함수
const callGPTApi = async (prompt) => {
    // console.log(`Bearer ${process.env.OPENAI_API_KEY}`)
  for (let i = 0; i < 3; i++) {
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
      console.error(`GPT API 호출 오류 (시도 ${i + 1}/${retries}):`, error.message);
      if (i === retries - 1) {
        throw new Error('Error generating song lyrics after multiple attempts: ' + error.message); // 최대 시도 후 에러 발생
      }
    }
  }
};



module.exports = {
  createExtractPrompt,
  extractKeyword,
  createGPTPrompt,
  callGPTApi
};

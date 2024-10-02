const axios = require('axios');
require('dotenv').config({ path: '../../../.env' }); 

// 답변 문장에서 키워드 추출 GPT 프롬프트를 생성하는 함수
const createExtractPrompt = () => {
  
  return `
  너는 키워드를 추출해주는 어시스턴스야.
  아래 규칙에 맞춰서 키를 keyword, image_description으로 하는 json 응답을 해줘.

  규칙 : 
  입려된 문장에서 주어진 카테고리에 맞는 키워드를 하나만 뽑아줘. 
  그리고 그 키워드와 어울리는 색을 하나 #HEX 형식으로 추천해줘. 
  또한, 그 키워드에 맞는 사진의 설명을 작성해줘.
  문장에 적절한 키워드가 없다고 생각되면 없음을 출력해.
  `;
};

// 키워드 추출 GPT API를 호출하는 함수
const extractKeyword = async (sentence, field) => {
  const prompt = createExtractPrompt();
  
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o', 
      messages: [
        { role: "system", "content": prompt},
        { role: "user", "content": `문장 : ${sentence} \n카테고리 : ${field}`}
      ],
      "response_format": {
        "type": "json_object"
      },
      max_tokens: 200
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    const gptText = response.data.choices[0].message.content.trim();
    console.log(gptText);
    return JSON.parse(gptText);

    // // 응답이 JSON 형식인지 검증
    // if (gptText.startsWith('{') && gptText.endsWith('}')) {
    //   // 응답이 JSON 형식이면 파싱
    //   return JSON.parse(gptText);
    // } else {
    //   // 응답이 JSON 형식이 아닐 경우 처리
    //   console.error('GPT API 응답이 JSON이 아닙니다:', gptText);
    //   throw new Error('GPT did not return valid JSON');
    // }

  } catch (error) {
    console.error('Error calling GPT API:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// 답변 문장에서 키워드 추출 GPT 프롬프트를 생성하는 함수
const createDirectPrompt = () => {
  
  return `
  너는 키워드의 이미지 설명을 만들어주는 어시스턴스야.
  아래 규칙에 맞춰서 키를 keyword, image_description으로 하는 json 응답을 해주면 돼.

  규칙 :
  키워드는 그대로 사용하고, 이 키워드와 어울리는 색을 하나 #HEX 형식으로 추천해줘. 
  또한, 키워드에 맞는 사진의 설명을 작성해줘.
  `
};

// 키워드 추출 GPT API를 호출하는 함수
const directKeyword = async (value, field) => {
  const prompt = createDirectPrompt();

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o', 
      messages: [
        { role: 'system', content: prompt},
        { role: 'user', content: `키워드 :  ${value} \n카테고리 : ${field}`}
      ],
      response_format : {
        'type': 'json_object'
      },
      max_tokens: 200
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    const gptText = response.data.choices[0].message.content.trim();
    console.log(gptText);
    return JSON.parse(gptText);
    
    // // 응답이 JSON 형식인지 검증
    // if (gptText.startsWith('{') && gptText.endsWith('}')) {
    //   // 응답이 JSON 형식이면 파싱
    //   return JSON.parse(gptText);
    // } else {
    //   // 응답이 JSON 형식이 아닐 경우 처리
    //   console.error('GPT API 응답이 JSON이 아닙니다:', gptText);
    //   throw new Error('GPT did not return valid JSON');
    // }

  } catch (error) {
    console.error('Error calling GPT API:', error.response ? error.response.data : error.message);
    throw error;
  }
};


const createGPTPrompt = (animalCharacterKeyword, selectedHabits, colorKeyword, foodKeyword) => {

  return `
  너는 아이들을 위한 동요 작가이다. 
  다음 규칙를 바탕으로, 5~7세 아이들이 이해하기 쉽고 교육적이며 짧은 동요 가사를 만들어.
  키가 title, lyric으로 이루어진 json 출력해.

  규칙 : 
  동물 또는 캐릭터(${animalCharacterKeyword})와 '나'가 주인공이며, 이 캐릭터가 ${selectedHabits}을 즐거워하며 수행하는 내용을 가사에 포함해.
  가사에 좋아하는 색깔(${colorKeyword})과 음식(${foodKeyword})을 적절히 넣어.
  가사는 유아의 상상력을 자극하고, 쉬운 단어를 사용해 4줄로 구성해.
  동물 또는 캐릭터, 습관에 따른 의성어와 의태어를 적절히 사용해 흥미롭게 표현해.
  `;
};

// 가사 생성 GPT API를 호출하는 함수
const callGPTApi = async (preferences) => {
  const { userId, likeAnimalOrCharacter, likeColor, likeFood, habits } = preferences;
  // 필수 데이터가 없을 경우 공백 또는 기본값으로 처리
  const animalCharacterKeyword = likeAnimalOrCharacter?.keyword || "";
  const colorKeyword = likeColor?.keyword || "";
  const foodKeyword = likeFood?.keyword || "";
  const selectedHabits = habits?.filter(habit => habit.selected).map(habit => habit.name).join(', ') || '습관이 없습니다';

  let prompt = createGPTPrompt(animalCharacterKeyword, selectedHabits, colorKeyword, foodKeyword);

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: prompt},
        { role: 'user', content: `동물 또는 캐릭터 : ${likeAnimalOrCharacter} \n색깔 : ${likeColor} \n음식 : ${likeFood} \n습관 : ${selectedHabits}`}
      ],
      response_format : {
        'type': 'json_object'
      },
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

const axios = require('axios');

// GPT 프롬프트를 생성하는 함수
const createGPTPrompt = (preferences) => {
  const { 주인공, 성별, 나이, 좋아하는_것, 싫어하는_것 } = preferences;
  return `
  Task :
  [
  "주어진 정보를 바탕으로 동요 가사 만들어 줘"
  ],
  Task_Rule :
  [
  "5~7세 수준의 쉬운 단어를 사용해.",
  "가사는 간단하게, 한 소절로 구성해줘.",
  "후렴구로 반복적으로 노래할 수 있는 부분을 만들어줘.",
  "싫어하는 것을 좋아하는 것과 연결하여 새로운 긍정적인 관점을 제공하는 스토리를 만들어줘",
  "논리적으로 가사 내용이 진행되도록 작성해줘.",
  "유아의 호기심과 상상력을 불러일으키고 흥미를 자극할 수 있도록 만들어 줘.",
  "내용에 적절한 의성어나 의태어를 사용해 줘.",
  "내용을 1인칭 시점으로, '나'가 들어가게 해줘",
  "가사는 150 token 이내로 생성되게 해줘"
  ],
  Person_info:
  [
  "주인공" : "${주인공}",
  "성별" : "${성별}",
  "나이" : "${나이}",
  "좋아하는 것" : ["${좋아하는_것.join('", "')}"],
  "싫어하는 것" : ["${싫어하는_것.join('", "')}"]
  ]
  Output_formation:
  [
  "Json 형식으로 제목, 후렴구로 만들어"
  ]
  `;
};

// GPT API를 호출하는 함수
const callGPTApi = async (prompt) => {
    console.log(`Bearer ${process.env.OPENAI_API_KEY}`)
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200
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
  createGPTPrompt,
  callGPTApi
};

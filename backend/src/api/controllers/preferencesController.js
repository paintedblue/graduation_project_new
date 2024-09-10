const UserInfo = require('../../models/userInfo');
const { createExtractPrompt, extractKeyword } = require('../gptAPI/gptFunctions');
require('dotenv').config({ path: '../../../.env' }); // 환경 변수 사용을 위해 dotenv 모듈 사용
const { saveLog } = require('./logSaver'); 


// 사용자 선호 데이터를 저장하는 컨트롤러
exports.savePreferences = async (req, res) => {
  console.log("선호도 fetch 받음");
  const { userId, field, value } = req.body;

  const allowedFields = ['likeFood', 'likeAnimal', 'likeColor', 'likeCharacter'];
  if (!allowedFields.includes(field)) {
    return res.status(400).json({ message: 'Invalid field' });
  }
  
  let gptResponse;
  let retryCount = 0;
  const maxRetries = 3;  // 최대 재시도 횟수

  try {
    while (retryCount < maxRetries) {
      // GPT 프롬프트 생성 및 호출
      const prompt = createExtractPrompt(value, field);
      //console.log("prompt : \n", prompt);
      const gptResponse = await extractKeyword(prompt);
      //console.log("Raw GPT Response (in server):\n", gptResponse);

      // 응답을 문자열로 변환 후 JSON 형식으로 정규화
      const responseString = JSON.stringify(gptResponse);  // 객체를 문자열로 변환
      const fixedResponse = responseString
        .replace(/(\w+):/g, '"$1":')  // 필드 이름에 따옴표 추가
        .replace(/'/g, '"');  // 작은따옴표를 큰따옴표로 변경

      try {
        // 정규화된 응답을 JSON으로 파싱
        const parsedResponse = JSON.parse(fixedResponse);
        console.log("Parsed gptResponse: ", parsedResponse);

        // 사용자 정보 찾기 또는 새로 생성
        let preferences = await UserInfo.findOne({ userId: userId });
        if (!preferences) {
          preferences = new UserInfo({ userId: userId });
        }

        // GPT 응답 결과를 해당 필드에 저장
        preferences[field] = {
          keyword: parsedResponse.keyword,
          color: parsedResponse.color,
          image_description: parsedResponse.image_description
        };

        await preferences.save();

        // 로그 저장 (한국어 설명과 details 포함)
        await saveLog(userId, `'${field}' 선호 데이터가 저장되었습니다.`, { field, keyword: parsedResponse.keyword, color: parsedResponse.color });

        return res.status(201).json(preferences[field]);

      } catch (jsonError) {
        console.error('Error parsing GPT response:', jsonError.message);
        retryCount++;  // 재시도 횟수 증가
        if (retryCount >= maxRetries) {
          return res.status(500).json({ message: 'Failed to get valid response from GPT after multiple attempts' });
        }
      }
    }
  } catch (error) {
    console.error('Error saving user preferences:', error);
    res.status(500).json({ message: 'Error saving user preferences', error });
  }
};

// 사용자 선호 데이터 가져오는 컨트롤러
// userId와 habits 필드를 제외하고 나머지 필드들은 모두 preferences로 묶어서 반환
exports.getPreferences = async (req, res) => {
  try {
    const { userId } = req.params;

    // 유저 데이터 찾기
    const user = await UserInfo.findOne({ userId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // userId와 habits를 제외한 나머지 필드를 preferences로 묶어서 반환
    const { habits, userId: id, ...preferences } = user.toObject();  // toObject()를 사용해 순수 JS 객체로 변환

    res.status(200).json({ userId: id, preferences });
    
  } catch (error) {
    console.error('Error getting preferences:', error);
    res.status(500).json({ message: "Error getting preferences", error });
  }
};

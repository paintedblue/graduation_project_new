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
  
  const maxRetries = 4; // 최대 재시도 횟수
  let retryCount = 0;
  let validResponse = false;
  let parsedResponse;

  try {
    // GPT API를 최대 maxRetries 횟수까지 재시도
    while (retryCount < maxRetries && !validResponse) {
      retryCount++;
      
      try {
        // GPT 프롬프트 생성 및 호출
        const prompt = createExtractPrompt(value, field);
        console.log(`GPT API 호출 시도 ${retryCount}/${maxRetries}...`);
        const gptResponse = await extractKeyword(prompt);

        // GPT 응답을 바로 사용하여 JSON 파싱 (불필요한 문자열 변환 제거)
        parsedResponse = gptResponse;

        // keyword가 'undefined'가 아닌지 확인
        if (parsedResponse.keyword && parsedResponse.keyword !== 'undefined' && parsedResponse.keyword !== 'none') {
          validResponse = true; // 유효한 응답을 받음
          console.log("유효한 GPT 응답을 받았습니다.");
        } else {
          console.warn(`'undefined' 키워드를 받았습니다. 다시 시도합니다. (${retryCount}/${maxRetries})`);
        }

      } catch (apiError) {
        console.error(`GPT API 호출 오류 (시도 ${retryCount}):`, apiError.message);
      }
    }

    // 유효한 응답이 없으면 실패 처리
    if (!validResponse) {
      return res.status(500).json({ message: 'GPT로부터 유효한 응답을 여러 번 시도했으나 받지 못했습니다.' });
    }

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

    // 로그 저장
    console.log(`'${field}' 필드의 선호 데이터로 '${parsedResponse.keyword}'가 저장되었습니다.`);
    await saveLog(userId, `'${field}' 선호 데이터가 저장되었습니다.`, {
      field,
      keyword: parsedResponse.keyword,
      color: parsedResponse.color
    });

    return res.status(201).json(preferences[field]);

  } catch (error) {
    console.error('사용자 선호 데이터를 저장하는 중 오류 발생:', error);
    res.status(500).json({ message: '사용자 선호 데이터를 저장하는 중 오류가 발생했습니다.', error });
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

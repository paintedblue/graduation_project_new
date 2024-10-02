const UserInfo = require('../../models/userInfo');
const { directKeyword, extractKeyword } = require('../gptAPI/gptFunctions');
require('dotenv').config({ path: '../../../.env' }); // 환경 변수 사용을 위해 dotenv 모듈 사용
const { saveLog } = require('./logSaver'); 


// 사용자 선호 데이터를 저장하는 컨트롤러
exports.savePreferences = async (req, res) => {
  console.log("선호도 fetch 받음");
  const { userId, field, value } = req.body;

  const allowedFields = ['likeFood', 'likeAnimalOrCharacter', 'likeColor'];
  if (!allowedFields.includes(field)) {
    return res.status(400).json({ message: 'Invalid field' });
  }
  
  const maxRetries = 4; // 최대 재시도 횟수
  let retryCount = 0;
  let validResponse = false;
  let parsedResponse;

  let generatedImageUrl;


  try {
    // GPT API를 최대 maxRetries 횟수까지 재시도
    while (retryCount < maxRetries && !validResponse) {
      retryCount++;
      
      try {
        // GPT 프롬프트 생성 및 호출
        // const prompt = createExtractPrompt(value, field);
        console.log(`GPT API 호출 시도 ${retryCount}/${maxRetries}...`);
        const gptResponse = await extractKeyword(value, field);

        // GPT 응답을 바로 사용하여 JSON 파싱 (불필요한 문자열 변환 제거)
        parsedResponse = gptResponse;

        if (parsedResponse.keyword && parsedResponse.keyword === '없음'){
          console.error("올바른 단어를 찾지 못했습니다. 다시 실행해주세요.");
        }

        // keyword가 'undefined'가 아닌지 확인
        if (parsedResponse.keyword && parsedResponse.keyword !== 'NaN' && parsedResponse.keyword !== 'error' && parsedResponse.keyword !== 'undefined' && parsedResponse.keyword !== 'none' && parsedResponse.keyword !== 'null' && parsedResponse.keyword !== 'N/A') {
          validResponse = true; // 유효한 응답을 받음
          console.log("유효한 GPT 응답을 받았습니다.");

          // DALL·E API로 이미지 생성
          generatedImageUrl = await generateImage(parsedResponse);

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
      image_description: parsedResponse.image_description,
      image_url: generatedImageUrl 
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

// 사용자 선호 데이터를 저장하는 컨트롤러
exports.saveDirectPreferences = async (req, res) => {
  console.log("선호도 fetch 받음");
  const { userId, field, value } = req.body;

  const allowedFields = ['likeFood', 'likeAnimalOrCharacter', 'likeColor'];
  if (!allowedFields.includes(field)) {
    return res.status(400).json({ message: 'Invalid field' });
  }

  const maxRetries = 4; // 최대 재시도 횟수
  let retryCount = 0;
  let validResponse = false;
  let parsedResponse;

  let generatedImageUrl;

  try {
    // GPT API를 최대 maxRetries 횟수까지 재시도
    while (retryCount < maxRetries && !validResponse) {
      retryCount++;

      try {
        // GPT API를 최대 maxRetries 횟수까지 재시도
        // const prompt = createDirectPrompt(value, field);
        console.log(`GPT API 호출 시도 ${retryCount}/${maxRetries}...`);
        const gptResponse = await directKeyword(value, field);

        // GPT 응답을 바로 사용하여 JSON 파싱 (불필요한 문자열 변환 제거)
        parsedResponse = gptResponse;

        if (parsedResponse.keyword && parsedResponse.keyword === '없음'){
          console.error("올바른 단어를 찾지 못했습니다. 다시 실행해주세요.");
        }

        // keyword가 'undefined'가 아닌지 확인
        if (parsedResponse.keyword && parsedResponse.keyword !== 'NaN' && parsedResponse.keyword !== 'error' && parsedResponse.keyword !== 'undefined' && parsedResponse.keyword !== 'none' && parsedResponse.keyword !== 'null' && parsedResponse.keyword !== 'N/A') {
          validResponse = true; // 유효한 응답을 받음
          console.log("유효한 GPT 응답을 받았습니다.");

          // DALL·E API로 이미지 생성
          generatedImageUrl = await generateImage(parsedResponse);

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
      image_description: parsedResponse.image_description,
      image_url: generatedImageUrl
    };

    await preferences.save();

    // 로그 저장
    console.log(`'${field}' 필드의 선호 데이터로 '${parsedResponse.keyword}'가 저장되었습니다.`);
    await saveLog(userId, `'${field}' 선호 데이터가 저장되었습니다.`, {
      field,
      keyword: parsedResponse.keyword,
      image_description: parsedResponse.image_description
    });

    return res.status(201).json(preferences[field]);

  } catch (error) {
    console.error('사용자 선호 데이터를 저장하는 중 오류 발생:', error);
    res.status(500).json({ message: '사용자 선호 데이터를 저장하는 중 오류가 발생했습니다.', error });
  }
};

const generateImage = async (parsedResponse) => {
  const { keyword, color, image_description } = parsedResponse;

  const prompt = `
  ${keyword}의 생동감 있는 일러스트레이션을 만들어.
  이미지 묘사("${image_description}.")에 맞게 만들어.
  전체적으로 ${color} 색상을 사용하면 돼.
  ${keyword}가 아무리 이상하더라도 일러스트레이션은 어린이에게 적합해야 해.
  `;

  try {
    const response = await fetch('https://api.aimlapi.com/images/generations', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": 'Bearer 955d6b2cb9594b61a07ba1c31b132381'
      },
      body: JSON.stringify({
        "prompt": prompt.trim(),  // 프롬프트 문자열을 보내기
        "model": "dall-e-3"
      }),
    });

    const data = await response.json();

    // console.log("DALL·E API Response Data:", data);
    
    // 응답에서 이미지 URL을 추출
    return data.data[0].url 

  } catch (error) {
    console.error('Error generating image:', error.message);
    throw error;
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

// 사용자 선호 필드를 초기화하는 컨트롤러
exports.resetPreferences = async (req, res) => {
  try {
    const { userId, field } = req.body;

    // 허용된 필드 목록
    const allowedFields = ['likeFood', 'likeAnimalOrCharacter', 'likeColor'];

    // 사용자 정보 찾기
    let user = await UserInfo.findOne({ userId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 필드가 없으면 모든 필드 초기화
    if (!field) {
      allowedFields.forEach(f => {
        user[f] = {
          keyword: null,
          color: null,
          image_description: null,
          image_url: null
        };
      });
    } else {
      // 특정 필드만 초기화
      user[field] = {
        keyword: null,
        color: null,
        image_description: null,
        image_url: null
      };
    }

    // 변경사항 저장
    await user.save();

    // 성공 응답
    if (!field) {
      return res.status(201).json({
        message: 'All preferences have been reset.'
      });
    } else {
      return res.status(201).json({
        message: `Preferences for field '${field}' have been reset.`,
        field: user[field]
      });
    }
  } catch (error) {
    console.error('Error resetting preferences:', error);
    return res.status(500).json({
      message: 'Error resetting user preferences',
      error: error.message
    });
  }
};

import React, { useEffect, useState } from 'react';
import Voice from '@wdragon/react-native-voice';;

const Test = () => {
  const [savedSongs, setSavedSongs] = useState([]);

  //-----------------------------------STT 시작-----------------------------------
  const [isRecord, setIsRecord] = useState<boolean>(false);
  const [text, setText] = useState<string>('');
  const buttonLabel = isRecord ? 'Stop' : 'Start';
  const voiceLabel = text
    ? text
    : isRecord
    ? 'Say something...'
    : 'press Start button';

    const _onSpeechStart = () => {
      console.log('onSpeechStart');
      setText('');
    };
    const _onSpeechEnd = () => {
      console.log('onSpeechEnd');
    };
    const _onSpeechResults = (event) => {
      console.log('onSpeechResults');
      setText(event.value[0]);
    };
    const _onSpeechError = (event) => {
      console.log('_onSpeechError');
      console.log(event.error);
    };
  
    const _onRecordVoice = () => {

      Voice.start('ko-KR');
      setIsRecord(!isRecord);
    };
  
    useEffect(() => {
      Voice.onSpeechStart = _onSpeechStart;
      Voice.onSpeechEnd = _onSpeechEnd;
      Voice.onSpeechResults = _onSpeechResults;
      Voice.onSpeechError = _onSpeechError;
  
      return () => {
        Voice.destroy().then(Voice.removeAllListeners);
      };
    }, []);
    //-----------------------------------STT 종료-----------------------------------
  };
export default Test;

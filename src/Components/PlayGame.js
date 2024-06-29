import React, { useEffect, useState } from 'react';

const PlayGame = ({ onChangeScore, timeLeft }) => {
  const [defaultData] = useState(
    'The sun was setting over the horizon, casting a golden glow over the tranquil ocean. Waves gently lapped against the shore, creating a soothing symphony of nature. As the day turned to night, the sky transformed into a canvas of brilliant colors, painting a picture of serenity and peace On the sandy beach, a family gathered around a bonfire, roasting marshmallows and sharing stories. Laughter filled the air as children chased each other, their footprints leaving temporary imprints on the soft sand. The warmth of the fire and the company of loved ones made the moment perfect In the distance, a lighthouse stood tall, its beacon guiding sailors safely to shore. The rhythmic flash of its light was a reminder of the enduring hope and guidance in lifes journey. As the stars began to twinkle in the night sky, a sense of wonder and gratitude enveloped everyone present.The simple joys of life, the beauty of nature, and the bonds of family and friends create memories that last a lifetime. These moments, though fleeting, leave an indelible mark on our hearts, reminding us of the importance of cherishing each day.'
  );

  const [datatyping, setdatatyping] = useState([]);
  const [textTyping, setTextTyping] = useState({
    value: '',
    position: 0
  });

  useEffect(() => {
    const addword = (quantity = 100) => {
      const arrayDefaultDB = defaultData.split(' ');
      const datatypingtest = [];

      for (let index = 0; index < quantity; index++) {
        const position = Math.floor(Math.random() * arrayDefaultDB.length);
        datatypingtest.push({
          value: arrayDefaultDB[position],
          status: null
        });
      }
      setdatatyping(datatypingtest);
    }

    if (datatyping.length === 0 || textTyping.position >= datatyping.length) {
      addword();
      setTextTyping({ ...textTyping, position: 0 });
    }
  }, [textTyping.position]);

  const handleChangeTyping = e => {
    const valueInput = e.target.value;
    if (!valueInput.includes(' ')) {
      setTextTyping({
        ...textTyping,
        value: valueInput
      });
    } else if (textTyping.value !== '') {
      checkresult();
    }
  }

  const checkresult = () => {
    const dataCheck = datatyping;
    const wordCheck = dataCheck[textTyping.position].value;

    if (textTyping.value === wordCheck) {
      dataCheck[textTyping.position].status = true
      onChangeScore('right')
    } else {
      dataCheck[textTyping.position].status = false
      onChangeScore('wrong')
    }
    setdatatyping(dataCheck);
    setTextTyping({
      value: '',
      position: textTyping.position + 1
    })
  }

  return (
    
    <div className="playing">
        
      
     <ul className='list'>
      <div className="timer">Time left: {timeLeft}s</div>
        
        {
            
          datatyping.map((word, index) =>
            <li key={index}
              className={
                word.status === true
                  ? 'true'
                  : word.status === false
                    ? 'false'
                    : ''
              }>
              {
                word.value
              }
            </li>)
        }
      </ul>
      <div className="inputForm">
        <input type="text" value={textTyping.value}
          onChange={handleChangeTyping} />
      </div>
    </div>
  )
}

export default PlayGame
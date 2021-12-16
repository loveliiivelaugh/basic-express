const router = require('express').Router();
const axios = require('axios');
const OpenAI = require('openai-api');

// Load your key from an environment variable or secret management service
// (do not include your key directly in your code)
const { OPENAI_API_KEY } = process.env;

const openai = new OpenAI(OPENAI_API_KEY);

const USE_GPT3 = true;

/**
 * Method: POST /api/gpt3/classify
 * API: postClassify()
 * Descr: Receives message from client api -- passes it to GPT-3. Then returns the response back to the client.
 */
router.post('/classify', async (req, res) => {
  const { transcript } = req.body;
  console.log(`Received message: ${transcript}`);
  // const type = req.body.transcript.type;
  const type = "context";

  const classifyUrl = 'https://api.openai.com/v1/classifications';
  const classificationGroups = (type = "context") => {
    switch (type) {
      case "finances":
        return {
          examples: [
            ["How much money do I have in my bank account?", "Accounts"],
            ["What was my most expensive transaction this month?", "Transactions"],
            ["How much of Apple do I own?", "Investments"],
            ["What was the closing price of Apple today?", "Stocks"],
            ["How much should I invest in Apple right now?", "Alpaca"],
          ],
          labels: ["Accounts", "Transactions", "Investments", "Stocks", "Alpaca", "Orders"],
        };
      case "context":
        return {
          examples: [
            ["How much money do I have in my bank account?", "question"],
            ["What was my most expensive transaction this month?", "question"],
            ["How much of Apple do I own?", "question"],
            ["What was the closing price of Apple today?", "question"],
            ["How much should I invest in Apple right now?", "question"],
            ["I am hanging in there, I have been so busy lately.", "conversation"],
            ["I love that movie!", "conversation"],
            ["I am 31 years old.", "conversation"],
            ["It's going to be a good day.", "conversation"],
            ["They are not the best when it comes to taking care of us quickly.", "conversation"],
            ["Transfer $100 from checking to savings, please.", "command"],
            ["Spin up a new React project for me, will ya?", "command"],
            ["Add Material-UI to this project.", "command"],
          ],
          labels: ["question", "conversation", "command"]
        };
      default:
        return;
  }
};

  console.log(transcript, classificationGroups(type).examples);
  try {
    if (USE_GPT3) {
      axios.post(classifyUrl, {
        "examples": classificationGroups(type).examples,
        "query": transcript,
        "search_model": "davinci",
        "model": "davinci",
        "labels": classificationGroups(type).labels
      }, {
          headers: {
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json"
          }
      })
      .then(classification => {
        console.log(classification.data)
        res.status(200).json(classification.data);
      })
    .catch(error => {
      console.error(error);
    });
  } else {
    res.status(200).json({ 
      message: "GPT-3 is turned off. Refer to the gpt3routes.js file to toggle it on and off."
    });
  }
  } catch (error) {
    console.error(error);
  }
});

/**
 * Method: POST /api/gpt3/completion
 * API: postCompletion()
 * Descr: Receives message from client api -- passes it to GPT-3. Then returns the response back to the client.
 */
router.post('/complete', async (req, res) => {
  console.log("GPT-3 Question Route: ",req.body);
  const { message } = req.body;
  try {
    if (USE_GPT3) {
      const gptResponse = await openai.complete({
        engine: 'davinci',
          prompt: message,
          maxTokens: 150,
          temperature: 1,
          topP: 1,
          presencePenalty: 1,
          frequencyPenalty: 1,
          bestOf: 1,
          n: 1,
          stream: false,
          stop: ['\n']
      });
      console.log(gptResponse.data);
      res.status(200).json(gptResponse.data);
    } else {
      res.status(200).json({ 
        message: "GPT-3 is turned off. Refer to the gpt3routes.js file to toggle it on and off."
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

/**
 * Method: POST /api/gpt3/question
 * API: postQuestion()
 * Descr: Receives question from client api -- passes it to GPT-3. Then returns the response back to the client.
 */
router.post('/question', async (req, res) => {
  console.log("GPT-3 Question Route: ",req.body);
  const { type, dialogue, transcript, classification, documents } = req.body;

  try {
    // const writeJSONLines = (documents) => {
    //   const jsonlFilename = "documents.jsonl";
    //   const writeStream = fs.createWriteStream(jsonlFilename);
    //   documents.map(x => writeStream.write(`${JSON.stringify(x)}\n`));
    //   writeStream.end();
    //   return {
    //     lines: documents.length,
    //     file: jsonlFilename,
    //   };
    // };
    
    // const jsonlFile = writeJSONLines(documents);
    // const jsonl = documents.map(x => `${JSON.stringify(x)}\n`);
    // console.log(jsonl);
    if (USE_GPT3) {
      const gptResponse = await openai.answers({
        "question": req.body.question,
        "search_model": "davinci",
        "model": "davinci",
        "temperature": 0,
        "documents": [],
        "examples_context": "a p p l e",
        "examples": [
          ["How do you spell dog?", "d o g"],
          ["How do you spell house?", "h o u s e"],
          ["How do you spell cat?", "c a t"],
          ["How do you spell country?", "c o u n t r y"],
          ["How do you spell car?", "c a r"],
        ],
        // "documents": jsonl,
        "max_tokens": 150,
        "return_prompt": true,
        n: 2,

        "stop": ["\n", "<|endoftext|>"],
      });

      console.log("Complete", gptResponse.data);

      res.status(200).json(gptResponse.data);
    } else {
      res.status(200).json({ 
        message: "GPT-3 is turned off. Refer to the gpt3routes.js file to toggle it on and off."
      });
    }
  } catch (error) {
    console.error(error.response);
    res.status(500).json(error);
  }
});

module.exports = router;

import { useEffect, useState } from 'react';
import axios from 'axios';

import Completion from '../components/Completion';
import Navbar from '../components/Navbar';
import Prompt from '../components/Prompt';
import PromptController from '../components/PromptController';
import Error from '../components/Error';


const API_URL = 'https://api.openai.com/v1/chat/completions'
const MESSAGES = [];

const Home = () => {
    const [loading, setLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    const personas = {
        default: 'Your are an expert programmer, and give detailed explantions with code implementations and examples.',
        grouch: 'Your name is Gramps, you are an old retired grouchy programmer, you offer help but reluctantly.',
        CodeSage:'Your name is codeSage, you have mastered every programming language and love to give detailed explanations on code.',
    };

    // Values for PromptController
    const [temperature, setTemperature] = useState(0.5);
    const [tokens, setTokens] = useState(512);
    const [nucleus, setNucleus] = useState(0.5);
    const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
    const [persona, setPersona] = useState(personas.default);
    const [threadSize, setThreadSize] = useState(3);
    const [showSettings, setShowSettings] = useState(false);

    // Values for Prompt
    const [conversation, setConversation] = useState('');

    // Sets the prompt with instructions.
    const promptOptions = `Respond in markdown and use a codeblock with the language if there is code. ${persona}`;

    // Values for Completion
    const [chatResponse, setChatResponse] = useState([]);

    function addUserMessage(message) {
        const userMessage = { role: 'user', content: message };
        MESSAGES.push(userMessage);
    }

    function getMessages(question) {
        const systemMessage = { role: 'system', content: promptOptions };
        if (!MESSAGES.length) {
            MESSAGES.push(systemMessage);
        }
        addUserMessage(question)
        return MESSAGES;
    }
    
    function getPromptData(question) {
        const promptData = {
            model: selectedModel,
            messages: getMessages(question),
            max_tokens: Number(tokens),
            temperature: Number(temperature),
            n: 1,
            stream: false,
            stop: ['STOP', 'User:'],
        };
        return promptData;
    }

    function getHeaders() {
        const options = {
            headers: {
                Authorization: `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,
                'Content-Type': 'application/json',
            },
        };
        return options;
    }

    const onSubmit = async (event, question) => {
        event.preventDefault();

        setLoading(true);

        // Adds user message to the messages array
        const promptData = getPromptData(question);
        const options = getHeaders();

        try {
            const response = await axios.post(API_URL, promptData, options);
            const data = response.data;
            const newChat = {
                botResponse: data.choices[0].message.content,
                promptQuestion: question,
                totalTokens: data.usage.total_tokens,
            };

            // Adds bot response to the messages array
            MESSAGES.push(data.choices[0].message);

            setLoading(false);
            setChatResponse([...chatResponse, newChat]);
        } catch (error) {
            setLoading(false);
            setError(error.response.data.error.message);
            setShowError(true);
            console.log(error.response);
        }
    };

    const reset = () => {
        setChatResponse([]);
        setConversation('');
    };

    // Scrolls to bottom of the page as new content is created
    useEffect(() => {
        window.scrollTo(0, document.body.scrollHeight);
    }, [chatResponse]);

    useEffect(() => {
        if (chatResponse.length > threadSize) {
            const newArray = [...chatResponse];
            newArray.splice(0, newArray.length - threadSize);
            setConversation(newArray.map((chat) => `${chat.promptQuestion}\n${chat.botResponse}\n`));
        } else {
            setConversation(chatResponse.map((chat) => `${chat.promptQuestion}\n${chat.botResponse}\n`));
        }
        console.log(conversation);
    }, [chatResponse, threadSize]);

    // Props for Prompt component
    const forPrompt = { onSubmit, loading };

    // Props for PromptController
    const forPrompController = {
        reset,
        tokens,
        nucleus,
        persona,
        personas,
        threadSize,
        showSettings,
        setTokens,
        setNucleus,
        setPersona,
        temperature,
        setThreadSize,
        setTemperature,
        setChatResponse,
        setSelectedModel,
    };

    const forError = {
        setShowError,
        error,
    };

    return (
        <>
            <Navbar showSettings={showSettings} setShowSettings={setShowSettings} />
            <div className='container-col auto mg-top-vlg radius-md size-lg '>
                {showError && <Error {...forError} />}
                <div className='container-col '>
                    {chatResponse && chatResponse.map((item, index) => <Completion {...item} key={index} />)}
                </div>
                <PromptController {...forPrompController} />
                <Prompt {...forPrompt} />
            </div>
        </>
    );
};

export default Home;

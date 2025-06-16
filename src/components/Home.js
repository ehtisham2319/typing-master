import React, { useEffect, useState } from 'react';

function Home() {
    const [cardText, setCardText] = useState('');
    const [text, setText] = useState('');
    const [targetId, setTargetId] = useState(1);
    const [comparisonResult, setComparisonResult] = useState([]);
    const [stats, setStats] = useState({
        totalWords: 0,
        correctWords: 0,
        mistakes: 0,
        remaining: 0,
    });

    const fetchData = async (id) => {
        try {
            const response = await fetch('/data.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const item = data.find(entry => entry.id === id);

            if (item) {
                setCardText(item.text);
            } else {
                setCardText('No matching data found.');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setCardText('Error loading data.');
        }
    };

    useEffect(() => {
        fetchData(targetId);
        setText(''); // clear user input when card changes
    }, [targetId]);

    // Compare only words that are fully typed (after space)
    useEffect(() => {
        const originalWords = cardText.trim().split(/\s+/);
        const typedWords = text.trim().split(/\s+/);
        const endsWithSpace = text.endsWith(' ');

        const result = [];
        const wordsToCompare = endsWithSpace ? typedWords.length : typedWords.length - 1;

        let correct = 0;
        let wrong = 0;

        for (let i = 0; i < originalWords.length; i++) {
            if (i < wordsToCompare) {
                if (typedWords[i] === originalWords[i]) {
                    result.push(<span key={i} style={{ color: 'blue' }}>{originalWords[i]} </span>);
                    correct++;
                } else {
                    result.push(<span key={i} style={{ color: 'red' }}>{originalWords[i]} </span>);
                    wrong++;
                }
            } else {
                result.push(<span key={i} style={{ color: 'black' }}>{originalWords[i]} </span>);
            }
        }

        setComparisonResult(result);
        setStats({
            totalWords: originalWords.length,
            correctWords: correct,
            mistakes: wrong,
            remaining: originalWords.length - (correct + wrong),
        });
    }, [text, cardText]);

    const handleClicknext = () => {
        setTargetId(prevId => prevId + 1);
    };

    const handleClickprevious = () => {
        setTargetId(prevId => prevId - 1);
    };

    const handlechange = (e) => {
        setText(e.target.value);
    };

    return (
        <div className='container my-3'>
            <div className="card">
                <div className="card-body">
                    {comparisonResult}
                </div>
            </div>
            <button className="btn btn-primary mt-3 mx-3" disabled={targetId <= 1} onClick={handleClickprevious}>Previous</button>
            <button className="btn btn-primary mt-3 mx-3" disabled={targetId >= 18} onClick={handleClicknext}>Next</button>
            <button className="btn btn-danger mt-3 mx-3" disabled>Total Words: {stats.totalWords}</button>
            <button className="btn btn-danger mt-3 mx-3" disabled>Remaining Words: {stats.remaining}</button>
            <button className="btn btn-danger mt-3 mx-3" disabled>Correct Words: {stats.correctWords}</button>
            <button className="btn btn-danger mt-3 mx-3" disabled>Mistakes: {stats.mistakes}</button>

            <div className="container my-3">
                <textarea
                    placeholder='Enter the above text here'
                    className="form-control"
                    id="text"
                    rows="9"
                    value={text}
                    onChange={handlechange}
                />
            </div>
        </div>
    );
}

export default Home;

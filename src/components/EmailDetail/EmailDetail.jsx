import { useEffect, Fragment } from "react";
import parse from "html-react-parser"

import useSendMessage from "../../hooks/useSendMessage";
import formatDate from "../../utils/formatDate";

import "./styles.css"

export default function EmailDetail({emailIDClicked, setEmailIDClicked}) {
    const { data, error, sendMessage, resetAll} = useSendMessage("GET_MESSAGE");

    useEffect(() => {
        sendMessage({id: emailIDClicked});
    }, []);

    return (
        <div>
            {error && (
                <p className="error">⚠️ Error: {error}</p>
            )}

            {data && (
                <div className="maildetail-container">
                    <div className="maildetail-header">
                        <h2>Subject: {data.subject}</h2>
                        <button onClick={() => {
                            setEmailIDClicked(null);
                            resetAll();
                            }}>
                                X
                        </button>
                    </div>
                    <div className="maildetail-info">
                        <div>
                            <p className="from">From: {data.from.name}</p>
                            <p>{data.from.address}</p>
                        </div>
                        <p className="date">{formatDate(data.createdAt)}</p>
                    </div>

                    <div className="maildetail-html">
                        {data.html.map((element, i ) =>  (
                            <Fragment key={i}>
                                {parse(element)}
                            </Fragment>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
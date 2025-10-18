import React, { useContext, useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import UserContext from '../../context/UserContext';
import financeDataApi from '../../utils/finance-data-api';
import { MessageHolder } from '../../components';

const ParsePdfPage = () => {
    const userContext = useContext(UserContext);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    function handleFileChange(e) {
        setFile(e.target.files?.[0] || null);
    }

    async function handleUpload() {
        if (!file) {
            userContext.setMessages([...(userContext.messages || []), { type: 'error', value: 'Please select a file' }]);
            return;
        }

        try {
            setLoading(true);
            const data = await financeDataApi.parsePdf(file, userContext.integrationToken);
            setResult(data);
            userContext.setMessages([...(userContext.messages || []), { type: 'success', value: 'File parsed successfully' }]);
        } catch (err) {
            userContext.setMessages([...(userContext.messages || []), { type: 'error', value: err?.error || 'Error parsing file' }]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="control">
            <div className="title">Parse PDF</div>

            <div className={"card " + ( userContext.mobileSize() ? "value-header" : "" )}>
                <div className="value-section">
                    <div className="info-text">Upload File</div>
                    <div>
                        <input type="file" accept="application/pdf" onChange={handleFileChange} />
                    </div>
                </div>
                <div className="value-section">
                    <div className="info-text">Actions</div>
                    <div>
                        <Button onClick={handleUpload} disabled={loading}>
                            {loading ? (<><Spinner animation="border" size="sm" /> Uploading</>) : 'Upload & Parse'}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="card vertical-align">
                <MessageHolder />

                {result && (
                    <div className="mt-3">
                        <h4>Result</h4>
                        <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(result, null, 2)}</pre>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ParsePdfPage;

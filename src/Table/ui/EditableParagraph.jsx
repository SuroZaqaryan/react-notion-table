import { useState, useRef, useEffect } from 'react';
import { Flex, Input, Typography, Button, Tooltip, theme } from 'antd';
import { Pencil, WandSparkles, Sparkles, Plus, CircleArrowUp } from 'lucide-react';

const { Text } = Typography;

const suggestions = [
    'Упростить язык',
    'Сделать текст более официальным',
    'Разбить на подпункты',
    'Исправить шаблонные фразы',
];

function EditableParagraph({
    value,
    onChange,
    label,
    as: Component = 'span',
    asProps = {},
}) {
    const { token } = theme.useToken();
    const [showPopup, setShowPopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedSuggestion, setSelectedSuggestion] = useState('');

    const editableRef = useRef(null);
    const popupRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                setShowPopup(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInput = () => {
        const newValue = editableRef.current?.innerText || '';
        onChange(newValue);
    };

    const applySuggestion = () => {
        if (!selectedSuggestion) return;

        setLoading(true);
        setTimeout(() => {
            onChange(selectedSuggestion);
            if (editableRef.current) {
                editableRef.current.innerText = selectedSuggestion;
            }
            setShowPopup(false);
            setLoading(false);
        }, 1000);
    };

    return (
        <div style={{ position: 'relative' }}>
            <Flex className="edit-paragraph-wrapper" align="center" gap={8}>
                <Tooltip className='edit-controls' title="Редактировать с помощью ИИ">
                    <Button
                        type="text"
                        onClick={() => setShowPopup(!showPopup)}
                        style={{minWidth: 32, background: showPopup ? '#E4E4E7' : '#fff' }}
                        icon={
                            <WandSparkles
                                style={{ display: 'flex', cursor: 'pointer' }}
                                size={16}
                                color="gray"
                            />
                        }
                    />
                </Tooltip>

                <Flex className="edit-paragraph" wrap align="center">
                    {label && (
                        <div style={{ display: 'flex', alignItems: 'center', marginRight: 10, whiteSpace: 'normal' }}>
                            {label}
                        </div>
                    )}

                    <Component
                        {...asProps}
                        ref={editableRef}
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={handleInput}
                        style={{
                            margin: 0,
                            borderRadius: 4,
                            minWidth: 100,
                            background: showPopup ? '#E4E4E7' : '#fff',
                            outline: 'none',
                            cursor: 'text',
                        }}
                    >
                        {value}
                    </Component>
                </Flex>
            </Flex>

            {showPopup && (
                <div
                    ref={popupRef}
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 40,
                        zIndex: 1000,
                        padding: 12,
                        borderRadius: 8,
                        marginTop: 0,
                        width: 700,
                    }}
                >
                    <Flex vertical gap={8}>
                        <Flex
                            align="center"
                            style={{
                                boxShadow: token.boxShadowSecondary,
                                background: '#fff',
                                border: '1px solid #E4E4E7',
                                padding: '8px 16px',
                                borderRadius: 12,
                            }}
                            gap={6}
                        >
                            <Plus style={{ cursor: 'pointer' }} />
                            <Input
                                value={selectedSuggestion}
                                onChange={(e) => setSelectedSuggestion(e.target.value)}
                                style={{ border: 'none', borderRadius: 4 }}
                                placeholder="Напишите, что нужно исправить в этом тексте"
                            />

                            <Button
                                type="text"
                                loading={loading}
                                icon={
                                    <CircleArrowUp
                                        color="#ffffff"
                                        fill="#1c1c1c"
                                        onClick={applySuggestion}
                                        size={30}
                                        strokeWidth={1}
                                        style={{ cursor: 'pointer' }}
                                    />
                                }
                            />
                        </Flex>

                        <Flex
                            vertical
                            style={{
                                boxShadow: token.boxShadowSecondary,
                                background: '#fff',
                                border: '1px solid #E4E4E7',
                                borderRadius: 8,
                            }}
                        >
                            {suggestions.map((suggestion) => (
                                <Button
                                    key={suggestion}
                                    type="text"
                                    style={{ textAlign: 'left', justifyContent: 'flex-start', padding: '24px 18px' }}
                                    icon={<Sparkles style={{ display: 'flex' }} size={16} />}
                                    onClick={() => setSelectedSuggestion(suggestion)}
                                >
                                    <Typography.Text style={{ fontSize: 16 }}>{suggestion}</Typography.Text>
                                </Button>
                            ))}
                        </Flex>
                    </Flex>
                </div>
            )}
        </div>
    );
}

export default EditableParagraph;

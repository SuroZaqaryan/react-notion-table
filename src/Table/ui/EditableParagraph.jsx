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

function EditableParagraph({ value, onChange, label, as: Component = 'span', asProps = {}, inputWidth = '100%' }) {
    const { token } = theme.useToken();

    const [editing, setEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);
    const [showPopup, setShowPopup] = useState(false);
    const [loading, setLoading] = useState(false);

    const [selectedSuggestion, setSelectedSuggestion] = useState('');
    const inputRef = useRef(null);
    const popupRef = useRef(null);

    const finishEditing = () => {
        setEditing(false);
        onChange(tempValue);
    };

    useEffect(() => {
        if (editing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editing]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                setShowPopup(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const applySuggestion = () => {
        if (!selectedSuggestion) return;

        setLoading(true);
        setTimeout(() => {
            const fakeServerResponse = selectedSuggestion;
            onChange(fakeServerResponse);
            setTempValue(fakeServerResponse);
            setShowPopup(false);
            setLoading(false);
        }, 1000);
    };

    return (
        <div style={{ position: 'relative' }}>
            <Flex align="center" gap={8}>
                <Flex style={{ position: 'relative', right: '1.5rem' }} gap={14}>
                    <Tooltip title="Редактировать с помощью ИИ">
                        <Button
                            type="text"
                            onClick={() => setShowPopup(!showPopup)}
                            style={{ background: showPopup ? '#E4E4E7' : '#fff' }}
                            icon={
                                <WandSparkles
                                    style={{ display: 'flex', cursor: 'pointer' }}
                                    size={16}
                                    color="gray"
                                />
                            }
                        />
                    </Tooltip>

                    <Tooltip title="Редактировать вручную">
                        <Button
                            type="text"
                            onClick={() => setEditing(true)}
                            style={{ background: editing ? '#E4E4E7' : '#fff' }}
                            icon={
                                <Pencil
                                    style={{ display: 'flex', cursor: 'pointer' }}
                                    size={16}
                                    color="gray"
                                />
                            }
                        />
                    </Tooltip>
                </Flex>

                <Flex gap={4} wrap={!editing} align='flex-end'>
                    {
                        label &&
                        <div style={{ display: 'flex', alignItems: 'center', marginRight: 10, whiteSpace: editing ? 'nowrap' : 'normal' }}>
                            {label}
                        </div>
                    }

                    {editing ? (
                        <Input
                            ref={inputRef}
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            style={{ minWidth: inputWidth }}
                            onPressEnter={finishEditing}
                            onBlur={finishEditing}
                            size="middle"
                        />
                    ) : (
                        <Component style={{ margin: 0, background: showPopup ? '#E4E4E7' : '#fff' }} {...asProps}>
                            {value}
                        </Component>
                    )}
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
                                rows={4}
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

import { useState, useRef, useEffect } from 'react';
import { Flex, Input, Typography } from 'antd';
import { Pencil, WandSparkles } from 'lucide-react';

const { Text } = Typography;

function EditableParagraph({ value, onChange, label, as: Component = 'span', asProps = {} }) {
    const [editing, setEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);
    const inputRef = useRef(null);

    const finishEditing = () => {
        setEditing(false);
        onChange(tempValue);
    };

    useEffect(() => {
        if (editing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editing]);

    return (
        <Flex align="center" gap={8}>
            <Flex style={{ position: 'relative', right: '2rem' }} gap={18}>
                <WandSparkles
                    style={{ cursor: 'pointer' }}
                    size={16}
                    color='#44403C'
                />

                <Pencil
                    onClick={() => setEditing(true)}
                    style={{ cursor: 'pointer' }}
                    size={16}
                    color='#44403C'
                />
            </Flex>

            {label && (
                <Text style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
                    {label}
                </Text>
            )}

            {editing ? (
                <Input
                    ref={inputRef}
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    style={{ minWidth: '100%' }}
                    onPressEnter={finishEditing}
                    onBlur={finishEditing}
                    size="middle"
                />
            ) : (
                <Component style={{ margin: 0 }} {...asProps}>{value}</Component>
            )}
        </Flex>
    );
}

export default EditableParagraph;

interface BadgeProps {
  value: React.ReactNode;
  backgroundColor?: string;
}

export default function Badge({ value, backgroundColor = '#fff' }: BadgeProps) {
  return (
    <span
      className="font-weight-400 d-inline-block color-grey-800 border-radius-sm text-transform-capitalize"
      style={{
        backgroundColor,
        width: '100%',
        padding: '3px 7px',
        cursor: 'pointer',
        overflow: 'hidden',
        display: 'inline-block',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
    >
      {value}
    </span>
  );
}

type ControlProps = {
  label: string;
  value: number;
  onChange: (val: number) => void;
};

export const Control: React.FC<ControlProps> = (props) => {
  return (
    <div>
      {props.label}: {props.value}
      <button
        style={{ marginLeft: '12px' }}
        onClick={() => props.onChange(props.value - 1)}
      >
        -
      </button>
      <button onClick={() => props.onChange(props.value + 1)}>+</button>
    </div>
  );
};

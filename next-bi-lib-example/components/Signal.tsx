import * as CSS from 'csstype';

const style = (isValid: boolean) => ({
  backgroundColor: isValid ? "green" : "red",
  height: "10px",
  width: "10px",
  borderRadius: "50%",
  top: "5px",
  position: "relative" as CSS.Property.Position,
})

const flex = { display: "flex" }

const signalText = { fontSize: "15px" }

interface SignalProps {
  isValid: boolean;
  text: string;
}

export const Signal = (props: SignalProps) => {
  const {
    isValid,
    text,
  } = props;

  return (
    <div>
      <div style={flex}>
        <div style={style(isValid)}></div>
        <div style={signalText}>{text}</div>
      </div>
    </div>
  );
}
import React, { useRef } from "react";
import SignatureCanvas, {
  type ReactSignatureCanvasProps,
} from "react-signature-canvas";

/* const SignaturePad = ({ onEnd }) => {
  const sigCanvas = useRef({});

  const clear = () => {
    sigCanvas.current.clear();
  };

  const save = () => {
    const signature = sigCanvas.current
      .getTrimmedCanvas()
      .toDataURL("image/png");
    onEnd(signature); // Appel de la fonction onEnd avec l'image de la signature
  };

  return (
    <div>
      <SignatureCanvas
        ref={sigCanvas}
        penColor="black"
        canvasProps={{ width: 500, height: 200, className: "sigCanvas" }}
      />
      <div>
        <button onClick={clear}>Effacer</button>
        <button onClick={save}>Enregistrer</button>
      </div>
    </div>
  );
}; */

const SignaturePad = React.forwardRef<
  HTMLDivElement,
  ReactSignatureCanvasProps
>(({ onEnd, ...props }, ref) => {
  const sigCanvas = useRef<typeof SignatureCanvas>(null);

  const clear = () => {
    sigCanvas.current?.clear();
  };

  const save = () => {
    const signature = sigCanvas.current?
      ?.getTrimmedCanvas()
      .toDataURL("image/png");
    onEnd(signature); // Appel de la fonction onEnd avec l'image de la signature
  };
  return (
    <>
      <SignatureCanvas
        ref={sigCanvas}
        penColor="black"
        canvasProps={{ width: 500, height: 200, className: "sigCanvas" }}
      />
      <div>
        <button onClick={clear}>Effacer</button>
        <button onClick={save}>Enregistrer</button>
      </div>
    </>
  );
});

export default SignaturePad;

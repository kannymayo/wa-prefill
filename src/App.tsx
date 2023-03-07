import { useState } from "react";

function App() {
  const [phoneRaw, setPhoneRaw] = useState("");
  const [link, setLink] = useState("");
  const defaultMsg =
    "Would appreciate if you could get back to me on the availability. Kindly let me know if you need our profile. Thanks!";
  const [message, setMessage] = useState(defaultMsg);
  // last 8 digits, ignoring all other chars
  const phone = phoneRaw.replace(/\D/g, "").slice(-8);

  return (
    <div className="w-96 mx-auto flex flex-col gap-4">
      <label className="form-control">
        <span className="label">Phone: {phone}</span>
        <input
          type="text"
          className="input input-primary"
          value={phoneRaw}
          onChange={(e) => setPhoneRaw(e.target.value)}
        />
      </label>

      <label className="form-control">
        <span className="label">Link</span>
        <textarea
          className="textarea textarea-primary"
          onChange={(e) => setLink(e.target.value)}
          value={link}
        ></textarea>
      </label>

      <div className="form-control">
        <div className="items-center flex gap-4 mb-2">
          <span className="label">Message</span>
          <button
            onClick={() => setMessage(defaultMsg)}
            className="btn btn-outline btn-sm"
          >
            Reset
          </button>
        </div>
        <textarea
          className="textarea textarea-primary min-h-[10em]"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        ></textarea>
      </div>

      <div onClick={handleOpenWA} className="btn btn-primary w-full">
        Start WA
      </div>

      <div className="divider"></div>

      <label className="form-control">
        <span className="label">Memo Board</span>
        <textarea className="textarea textarea-primary"></textarea>
      </label>
    </div>
  );

  function handleOpenWA() {
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(`Hi, I came across this listing and I'm very interested in it. Here's the link: ${link}

${message}`)}`;
    window.open(url, "_blank");
    setPhoneRaw("");
    setLink("");
  }
}

export default App;

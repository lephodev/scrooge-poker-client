import { emojis, gifs } from "../../emojiGif";
import { Tabs, Tab, Modal } from "react-bootstrap";
import { useEffect } from "react";
import { socket } from "../../config/socketConnection";

const MarketStore = ({ showStore, setShowStore, userid, tableId }) => {
  useEffect(() => {
    socket.on("newItem", ({ to, icon, label, type }) => {
      const ele = document.getElementById(`store-item-${to}`);
      let newItem;
      if (type === "emoji") {
        newItem = document.createElement("span");
        newItem.innerHTML = icon;
      } else {
        newItem = document.createElement("img");
        newItem.src = icon;
        newItem.alt = label;
      }
      ele.appendChild(newItem);
    });
  }, []);

  const handleSelectItem = (item, type) => {
    socket.emit("giftItem", {
      icon: item.icon,
      label: item.label,
      to: userid,
      type,
      tableId,
    });
    setShowStore(false);
  };

  return (
    <div className="store">
      <Modal show={showStore} onHide={() => setShowStore(false)}>
        <Modal.Header>
          <Modal.Title>Market Store</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs
            defaultActiveKey="profile"
            id="uncontrolled-tab-example"
            className="mb-3"
          >
            <Tab eventKey="emoji" title="Emojis">
              {emojis.map((item) => (
                <div
                  className="emoji"
                  onClick={() => handleSelectItem(item, "emoji")}
                >
                  {item.icon}
                </div>
              ))}
            </Tab>
            <Tab eventKey="gifs" title="Gifs">
              {gifs.map((item) => (
                <div className="gif">
                  <img
                    src={item.icon}
                    alt={item.label}
                    onClick={() => handleSelectItem(item, "gif")}
                  />
                </div>
              ))}
            </Tab>
          </Tabs>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MarketStore;

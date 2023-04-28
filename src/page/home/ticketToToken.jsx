import React, { useState } from "react";
import PropsTypes from "prop-types";
import InputRange from "react-input-range";
import { Modal, Button, Spinner } from "react-bootstrap";
import "react-input-range/lib/css/index.css";
import { ticketTotokenInstance } from "../../utils/axios.config";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { landingClient } from "../../config/keys";
import userUtils from "../../utils/user";

function TicketTotoken({ show, handleClose, user, setUser }) {
  const [rangeValue, setRangeValue] = useState(10);
  const [maxValue, setMaxvalue] = useState(user ? user?.ticket : 0);
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    setMaxvalue(user?.ticket)
  }, [user?.ticket])
  const getUserProfile = async () => {
    const data = await userUtils.getAuthUserData()
    if (!data.success) {
      return (window.location.href = `${landingClient}`)
    }
    setLoader(false)
    setUser({ ...data?.data?.user })
  }
  const handleconfirm = async () => {
    setLoader(true);
    try {
      const res = await ticketTotokenInstance().get(
        `coverttickettotoken/${rangeValue}/${rangeValue}/${user?.id}`
      );
      if (res.data.success) {
        if (localStorage.getItem("token")) {
          await getUserProfile();
        }
        toast.success("Converted Successfully", { toastId: "converted" });
        setLoader(false);
        setRangeValue(10);
        handleClose();
      } else {
        toast.error(res.data.message, { toastId: "converted" });
        setLoader(false);
        setRangeValue(10);
        handleClose();
      }
    } catch (err) {
      toast.error(err.response.data.message, { toastId: "addcomment" });
      setLoader(false);
      setRangeValue(10);
      handleClose();
    }
  };

  const handlePopup = () => {
    setRangeValue(10);
    handleClose();
  };
  return (
    <Modal
      show={show}
      onHide={handlePopup}
      //   backdrop="static"
      className="ticket-token-modal"
    >
      <Modal.Body>
        <div className="ticket-to-token-popup">
          <h6>Continue Playing</h6>
          <h6>
            Swap your tickets back to Sweep <br /> tokens at a 1:1 ratio
          </h6>
          <div className="total tickets">
            <h6>
              Ticket <span>{user && user?.ticket ? user?.ticket : "0.00"}</span>
            </h6>
          </div>
          <div className="inputRange-Box">
            <InputRange
              maxValue={maxValue}
              minValue={10}
              value={rangeValue}
              onChange={(value) => setRangeValue(value)}
            />
            <div className="min-max-value">
              <p>Amount to swap: {rangeValue}</p>
              <Button
                className="yellowBtn btn btn-primary"
                onClick={() => setRangeValue(maxValue)}
              >
                Max
              </Button>
            </div>
          </div>
          <div className="confirm-btn">
            <Button
              className="yellowBtn btn btn-primary"
              onClick={handleconfirm}
            >
              {loader ? (
                <Spinner animation="border" variant="dark" />
              ) : (
                "Confirm"
              )}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
TicketTotoken.propTypes = {
  handleClose: PropsTypes.func.isRequired,
  show: PropsTypes.bool.isRequired,
  user: PropsTypes.objectOf.isRequired,
  setUser: PropsTypes.func.isRequired,
};
export default TicketTotoken;

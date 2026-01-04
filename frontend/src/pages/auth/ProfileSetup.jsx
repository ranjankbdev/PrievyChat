function ProfileSetup() {
  return (
    <div className="modal d-block" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 p-3">
          <div className="d-flex align-items-center mb-3 position-relative border-bottom border-secondary pb-3">
            {/* back button */}
            <button
              className="btn px-2 py-1 position-absolute pt-2 profile-back-hover"
              style={{ color: '#cbc6c6ff' }}
            >
              <i className="fa-solid fa-arrow-left fs-4"></i>
            </button>

            {/* center title */}
            <h5 className="w-100 text-center text-white m-0">Set Up Your Profile</h5>
          </div>

          <div className="d-flex">
            {/* profile image container */}

            <div></div>

            {/* input Fields */}
            <div className="d-flex flex-column justify-content-center mt-3">
              <input type="text" disabled className="form-control mb-3 w-100" />
              <input type="text" placeholder="Enter your name" className="form-control w-100" />
            </div>
          </div>

          {/* save the user button */}
          <button className="btn mt-5 btn-primary w-100">
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileSetup;

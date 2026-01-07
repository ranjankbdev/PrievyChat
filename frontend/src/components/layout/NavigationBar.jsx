import './NavigationBar.css';

function NavigationBar() {
  return (
    <>
      <div className="d-flex justify-content-between p-2">
        {/* left section search user */}
        <div className="d-flex align-items-center cursor-pointer rounded px-1 py-1 search-nav-hover  ms-2">
          <i className="mx-2 fa-solid fa-magnifying-glass"></i>
          <span className="mx-3 me-4">Start a new chat</span>
        </div>
        {/* header */}
        <div className="text-center mx-2">
          <h3>Prievy-Chat</h3>
        </div>
        {/* right section */}
        <div className="d-flex align-items-center justify-content-end mx-2">
          {/* notification */}
          <span className="cursor-pointer notification-bell-hover p-1 px-2 me-2">
            <i className="fa-solid fa-bell fs-6"></i>
          </span>
          {/* user dropdown */}
          <span className="">User Name</span>
        </div>
      </div>
    </>
  );
}

export default NavigationBar;

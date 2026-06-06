const SwitchButton = (props: any) => {
  const { labels, checked, onChange } = props;

  const toggleSwitch = () => {
    onChange(!checked);
  };

  return (
    <label htmlFor="switch" className="flex items-center cursor-pointer">
      <div className="relative">
        <input
          id="switch"
          type="checkbox"
          className="sr-only"
          onChange={toggleSwitch}
        />
        <div
          className={`block bg-gray-600 w-20 h-8 rounded-full transition ease-in-out duration-300 hover:bg-gray-400`}
        >
          <span
            className={`absolute transition text-xs text-white transform${
              checked ? " -translate-x-1/2 left-7" : " -translate-x-1/2 right-1"
            } top-1/2 -translate-y-1/2`}
          >
            {checked ? labels[0] : labels[1]}
          </span>
        </div>
        <div
          className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ease-in-out duration-300 ${
            checked ? "translate-x-12" : "translate-x-0"
          }`}
        ></div>
      </div>
    </label>
  );
};

export default SwitchButton;

const Edit = ({ attributes, setAttributes, ...props }) => {
  const updateAttribute = (name) => {
    return (evt) => {
      if (evt.preventDefault) evt.preventDefault();

      const { value } = evt.currentTarget;

      setAttributes({
        [name]: value
      });
    };
  };

  return (
    <div>
      <input type={"text"}
             className={"yuiti_demo_input"}
             defaultValue={attributes.name}
             onChange={updateAttribute("name")} />
    </div>
  );
};

export default Edit;

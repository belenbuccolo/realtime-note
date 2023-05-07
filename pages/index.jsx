const IndexPage = () => {
  return (
    <main>
      <button onClick={() => (window.location = "/api/create")}>
        Create note
      </button>
    </main>
  );
};

export default IndexPage;

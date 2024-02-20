import React, { useState, useEffect } from "react";

const Home: React.FC = () => {
  const [message, setMessage] = useState("");
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        const headers = new Headers();
        if (accessToken) {
          headers.append("Authorization", `Bearer ${accessToken}`);
        }

        const response = await fetch("http://localhost:8080/api/user", {
          headers,
        });

        if (response.ok) {
          const content = await response.json();

          setMessage(`Hi ${content.name}`);
          setAuth(true);
        } else {
          setMessage("You are not logged in");
          setAuth(false);
        }
      } catch (e) {
        setMessage("You are not logged in ");
        setAuth(false);
      }
    };

    fetchData();
  }, []);

  return <div>{message}</div>;
};

export default Home;

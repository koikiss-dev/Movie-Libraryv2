import styled from "styled-components";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { movieApi } from "../../services/api/movieApi";
import CardItemRecor from "./CardItemRecor";
import { DotPulse } from "@uiball/loaders";
const Container = styled.form`
  width: 100%;
  position: absolute;
  z-index: 10000;
  /* background: rgba(43, 43, 43, 0.42);
  backdrop-filter: blur(3px); */
  padding: 0 var(--padding-separate-lr);
  top: 85px;
  left: 0;
  height: 100%;
  display: ${(props) => props.visibleSearch};
`;
const Input = styled.input`
width: 100%;
box-shadow: var(--shadow-list);
  font-size: 18px;
  padding: 18px 1.5rem;
  border: 2px solid var(--primary);
  border-radius: 10px;
  outline: none;
  background-color: #f3f3f4;
  color: var(--text-dark);
  transition: 0.3s ease;
  color: var(--text-dark);
  &::placeholder {
    color: var(--primary);
    font-size: 18px;
  }
  }
  `;
const ContainerRecommendation = styled.div`
display: ${(props) => props.visible};
box-shadow: var(--shadow-list);
margin: 1rem 0;
padding: 2rem;
border-radius: 10px;
line-height: 30px;
background: var(--bg);
overflow: hidden;
height: 230px;
overflow-y: auto;

`;
const Search = ({ valuebool, fun }) => {
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [value, setValue] = useState();
  const d = useRef("")
  const router = useRouter();
  const SearchData = (e) => {
    setValue(d.current.value);
  };
  const GetMovieSearch = async () => {
    try {
      setLoader(true);
      const { data } = await movieApi.get("/search/multi", {
        params: {
          query: d.current.value,
          include_adult: true,
        },
      });
      const response = data.results;
      setLoader(false);
      setData(response);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    GetMovieSearch();
  }, [value]);
  return (
    <Container
      visibleSearch={valuebool === true ? "block" : "none"}
      onSubmit={(e) => e.preventDefault()}
    >
      <Input
        onChange={SearchData}
        type={"text"}
        placeholder="Search movies and series"
        autoFocus
        ref={d}
      />
      <ContainerRecommendation visible={d.current.value === "" ? "none" : "block"}>
        {data.map(
          ({ name, title, vote_average, id, poster_path, media_type }) => {
            return (
              <CardItemRecor
                key={id}
                name={name}
                title={title}
                image={poster_path}
                media_type={media_type}
                id={id}
              />
            );
          }
        )}
      </ContainerRecommendation>
    </Container>
  );
};

export default Search;

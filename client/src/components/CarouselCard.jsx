import { useEffect, useState } from "react";
import TextTruncate from "react-text-truncate";
import axios from "axios";
import HlsPLayer from "./HlsPlayer";
import { useNavigate } from "react-router-dom";
import AnimePlayerModal from "./AnimePlayerModal";
export default function CarouselCard({
  setUrl,
  onOpenModal,
  title,
  image,
  rowTitle,
  episodeNum,
  rating,
  id,
}) {
  const navigate = useNavigate();
  useEffect(() => {
    window.addEventListener("resize", () => {
      setWindowSize(window.innerWidth);
    });
  });
  const [link, setLink] = useState("");
  const [animeInfo, setAnimeInfo] = useState(null);
  const [episodes, setEpisodes] = useState(null);
  const [windowSize, setWindowSize] = useState(window.innerWidth);
  const [videoIsLoading, setVideoIsLoading] = useState(false);

  const calculateSize = (windowSize) => {
    if (windowSize > 1700) return [340, 230];
    else if (windowSize > 1600 && windowSize < 1700) return [230, 360];
    else if (windowSize > 1300 && windowSize < 1600) return [200, 310];
    else if (windowSize >= 800 && windowSize < 1300) return [180, 270];
    else if (windowSize >= 475 && windowSize < 800) return [130, 225];
    else if (windowSize >= 440 && windowSize < 475) return [130, 210];
    else if (windowSize >= 420 && windowSize < 440) return [130, 185];
    else if (windowSize >= 390 && windowSize < 420) return [110, 175];
    else if (windowSize >= 360 && windowSize < 390) return [110, 165];
    else return [90, 150];
  };

  async function fetchVideoById(url) {
    return await axios.get(url).then((response) => {
      setEpisodes(response.data);
      setLink(response.data.sources[1].url);
      setUrl(response.data.sources[1].url);
      onOpenModal();
    });
  }
  async function fetchVideo(id) {
    setVideoIsLoading(true);
    return await axios
      .get("https://consumet-api.herokuapp.com/meta/anilist/info/" + id)
      .then((res) => {
        setAnimeInfo(res.data);

        fetchVideoById(
          " https://consumet-api.herokuapp.com/meta/anilist/watch/" +
            res.data.episodes[0].id
        );
      })
      .catch((e) => {
        console.log(e);
      });
  }
  return (
    <>
      <div
        onClick={() => {
          fetchVideo(id);
        }}
        className="animecard-wrapper"
        style={{
          display: "flex",

          flexDirection: "column",
          alignItems: "center",
          height: "fit-content",

          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            borderRadius: "10px",
            backgroundImage: `url(${image})`,
            height: calculateSize(windowSize)[0],
            width: calculateSize(windowSize)[1],
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        ></div>

        {episodeNum > 0 && (
          <h5 style={{ color: "white", fontWeight: "lighter" }}>
            Episode {episodeNum}
          </h5>
        )}

        <a
          href="/"
          className="anime-card-title"
          style={{ color: "white", fontWeight: "lighter" }}
        >
          <TextTruncate text={title} line={2}></TextTruncate>
        </a>
      </div>
    </>
  );
}

import React, { useEffect, useState } from "react";
import nftActor from "../utils/nftActor";
import "../components/Marketplace.scss";

const Marketplace = () => {
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const result = await nftActor.getAllTokens();
        setNfts(result);
      } catch (error) {
        console.error("Error obteniendo NFTs:", error);
      }
    };

    fetchNFTs();
  }, []);

  return (
    <div className="marketplace">
      <h2>NFTs creados</h2>
      <div className="nft-grid">
        {nfts.map(([id, metadata]) => (
          <div key={id} className="nft-card">
            <h4>ID: {id.toString()}</h4>
            <ul>
              {metadata.map((item, index) => (
                <li key={index}>
                  <strong>{item.name}:</strong> {item.value}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;

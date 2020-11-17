import React from "react";
import currentTrack from "../pages/player";

export default function Lecteur() {
  return (
    <div id="LecteurFooter" className="col-12" color="">
      <img
        className="col-3"
        src="https://d1fmx1rbmqrxrr.cloudfront.net/cnet/optim/i/edit/2019/04/eso1644bsmall__w770.jpg"
        width="150vh"
        height="180vh"
      />
      <div>
        <div className="col-6">
          <p>Nom de la Musique: {currentTrack}</p>
        </div>
        <div className="col-6">Nom de l'artiste</div>
      </div>
    </div>
  );
}

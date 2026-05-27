/// <reference path="./spicetify.d.ts" />

(async function albumStreams() {
    if (!Spicetify.Player || !Spicetify.React || !Spicetify.ReactDOM || !Spicetify.Platform || !Spicetify.GraphQL) {
        setTimeout(albumStreams, 300)
        return
    }

    // -- Variables --
    const fname = "album-streams.js"
    const levels = {
        info: "[INFO] " + fname,
        warn: "[WARN] " + fname,
        err: "[ERROR] " + fname
    }

    const log = (level, msg) => {
        console.log(`${level} ${msg}`)
    }

    // sent loaded message
    log(levels.info, "EXTENSION LOADED....")

    // -- Functions -- 
    // Spicetify pathname
    /**
     * @param {string} path - Spicetify path
     * @returns {object}
    */
    const extractPath = (path) => {
        const pathSplit = path.split("/") // ["", "album", "<id>"]
        const pathType = pathSplit[1]
        const albumId = pathSplit[2]

        return {
            pathType: pathType,
            albumId: albumId
        }
    }
    /**
     * 
     * @param {string} albumId - album ID
     * @returns {any[]}
     */
    const extractPlayCounts = async (albumId) => {
        const reconstructedUri = "spotify:album:" + albumId
        const data = await Spicetify.GraphQL.Request(getAlbum, {
            uri: reconstructedUri, locale: "en", limit: 50, offset: 0
        }, { persistCache: true })
        const tracks = data.data.albumUnion.tracksV2.items
        if (tracks == undefined || !tracks) {
            throw new Error(levels.err + "DATA DID NOT LOAD ON TIME.... DEBUG")
        }
        const albumPlayCounts = []
        
        tracks.forEach(track => {
            try { 
                const streamCountToNum = Number(track.track.playcount)
                albumPlayCounts.push(streamCountToNum)

            } catch (e) {
                log(levels.err, "COULD NOT CONVERT STREAM COUNT TO NUMBER")
                throw new Error("exiting iife... please reload page for new changes")
            }
        })

        return albumPlayCounts
    }
   /**
     * 
     * @param {number[]} albumPlayCounts - olay counts from each track (unordered)
     * @returns {string} abbreviated sum of play counts in an album's tracks
     */
    const sumPlayCounts = (albumPlayCounts) => {
        var sum = 0
        for (var i = 0; i < albumPlayCounts.length; i++) {
            sum += albumPlayCounts[i]
        }
        // reimplement if global does not work
        return abbreviateNumber(sum)
    }

   /**
     * @param {string} totalStreamCount - abbrviated stream count of total album tracks
     */
    const constructHTML = (totalStreamCount) => {
        const headerMeta = document.querySelector(".main-entityHeader-metaData")

        if (!headerMeta) {
            setTimeout(constructHTML, 300, totalStreamCount)
            log(levels.info, "waiting for els to load")
        }

        const sepSpan = document.createElement("span")
        const totalCountSpan = document.createElement("span")

        sepSpan.className = "e-91000-text encore-text-body-small encore-internal-color-text-subdued"
        sepSpan.innerText = '•'
        sepSpan.style.marginLeft = "4px"
        sepSpan.style.marginRight = "4px"

        totalCountSpan.className = "e-91000-text encore-text-body-small-bold"
        totalCountSpan.innerText = "\u{25B6} " + totalStreamCount


        headerMeta?.appendChild(sepSpan)
        headerMeta?.appendChild(totalCountSpan)

    }

    const listenerFunc = async (location) => {
        const path = extractPath(location.pathname)
        log(levels.info, path.pathType + " " + path.albumId)

        if (path.pathType == "album") {
            const playCounts = await extractPlayCounts(path.albumId)
            log(levels.info, playCounts)
            const sumCounts = sumPlayCounts(playCounts)
            log(levels.info, sumCounts)
            try {
                constructHTML(sumCounts)
                log(levels.info, "constructed html elements")
            } catch {
                throw new Error("SOMETHING HAPPENED WHEN CONSTRUCTING HTML... RELOAD FOR NEW CHANGES")
            }
        } else {
            // immediately exit the iife because the page is not an album
            return
        }
    }

    // main code

    /*
     * CSS Separator class for main-entityHeader-metaData
     * e-91000-text encore-text-body-small encore-internal-color-text-subdued
     * 
     * CSS Bolded
     * e-91000-text encore-text-body-small-bold
     */

    // run once
    await listenerFunc(Spicetify.Platform.History.location)
    // page listener
    Spicetify.Platform.History.listen(async (location) => {

        await listenerFunc(location)
    })
})();

// your mom gay :)
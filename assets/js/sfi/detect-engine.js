// ════════════════════════════════════════════════════
// Detect Engine – Model Loading & Classification
// Single Responsibility: Load TF.js models, run inference,
// map raw predictions to SFI categories, crop regions.
// ════════════════════════════════════════════════════

const DetectEngine = (() => {
  let cocoModel = null;
  let mnetModel = null;
  let _ready = false;

  function isReady() { return _ready; }

  async function loadModels(onProgress) {
    try {
      onProgress('Loading TensorFlow.js runtime\u2026', 15);
      await tf.ready();

      onProgress('Loading object detection model (COCO-SSD)\u2026', 35);
      cocoModel = await cocoSsd.load({ base: 'lite_mobilenet_v2' });

      onProgress('Loading classification model (MobileNet)\u2026', 70);
      mnetModel = await mobilenet.load({ version: 2, alpha: 1.0 });

      _ready = true;
      onProgress('Models ready \u2014 upload an image or start your camera', 100);
      return true;
    } catch (err) {
      console.error('Model loading failed:', err);
      onProgress('Failed to load models \u2014 check your connection and refresh', -1);
      return false;
    }
  }

  async function runDetection(imgEl) {
    const [cocoResults, mnetResults] = await Promise.all([
      cocoModel.detect(imgEl),
      mnetModel.classify(imgEl, 10)
    ]);
    return { cocoResults, mnetResults };
  }

  async function classifyRegions(imgEl, cocoResults) {
    const regions = [];
    for (const det of cocoResults) {
      if (det.score < 0.25) continue;
      try {
        const cropped = cropRegion(imgEl, det.bbox);
        const cropClass = await mnetModel.classify(cropped, 5);
        regions.push({ bbox: det.bbox, cocoClass: det.class, cocoScore: det.score, mnetClasses: cropClass });
      } catch (e) {
        regions.push({ bbox: det.bbox, cocoClass: det.class, cocoScore: det.score, mnetClasses: [] });
      }
    }
    return regions;
  }

  function cropRegion(imgEl, bbox) {
    const [x, y, w, h] = bbox;
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(w, 10);
    canvas.height = Math.max(h, 10);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imgEl, x, y, w, h, 0, 0, canvas.width, canvas.height);
    return canvas;
  }

  function mapToSFI(globalMnet, regionClassifications) {
    const scores = {};
    SFI_CATEGORIES.forEach(cat => { scores[cat.name] = { score: 0, matches: [], cat }; });

    globalMnet.forEach(pred => {
      const label = pred.className.toLowerCase();
      SFI_CATEGORIES.forEach(cat => {
        cat.mnetKeys.forEach(key => {
          if (label.includes(key.toLowerCase())) {
            scores[cat.name].score += pred.probability * 0.8;
            if (!scores[cat.name].matches.includes('image: ' + pred.className)) {
              scores[cat.name].matches.push('image: ' + pred.className);
            }
          }
        });
      });
    });

    regionClassifications.forEach(region => {
      SFI_CATEGORIES.forEach(cat => {
        cat.cocoKeys.forEach(key => {
          if (region.cocoClass.toLowerCase().includes(key.toLowerCase())) {
            scores[cat.name].score += region.cocoScore * 0.3;
          }
        });
      });

      region.mnetClasses.forEach(pred => {
        const label = pred.className.toLowerCase();
        SFI_CATEGORIES.forEach(cat => {
          cat.mnetKeys.forEach(key => {
            if (label.includes(key.toLowerCase())) {
              scores[cat.name].score += pred.probability * 1.0;
              if (!scores[cat.name].matches.includes('region: ' + pred.className)) {
                scores[cat.name].matches.push('region: ' + pred.className);
              }
            }
          });
        });
      });
    });

    SFI_CATEGORIES.forEach(cat => { scores[cat.name].score += cat.boost; });

    const results = Object.values(scores)
      .filter(r => r.score > 0.05)
      .sort((a, b) => b.score - a.score);

    if (results.length > 0) {
      const maxScore = results[0].score;
      results.forEach(r => {
        r.confidence = Math.min(95, Math.round((r.score / Math.max(maxScore, 0.5)) * 85));
      });
    }

    return results;
  }

  function matchRegionToCategory(region, fallbackCat) {
    let bestCat = null;
    let bestScore = 0;

    SFI_CATEGORIES.forEach(cat => {
      let regionScore = 0;
      cat.cocoKeys.forEach(key => {
        if (region.cocoClass.toLowerCase().includes(key)) regionScore += region.cocoScore;
      });
      region.mnetClasses.forEach(pred => {
        const label = pred.className.toLowerCase();
        cat.mnetKeys.forEach(key => {
          if (label.includes(key.toLowerCase())) regionScore += pred.probability;
        });
      });
      if (regionScore > bestScore) {
        bestScore = regionScore;
        bestCat = cat;
      }
    });

    return bestCat || fallbackCat;
  }

  return { loadModels, isReady, runDetection, classifyRegions, mapToSFI, matchRegionToCategory };
})();

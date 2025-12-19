def algae_score(algae_area, frame_area):
    ratio = algae_area / frame_area

    if ratio < 0.02:
        return 5
    elif ratio < 0.05:
        return 25
    elif ratio < 0.1:
        return 50
    else:
        return 75

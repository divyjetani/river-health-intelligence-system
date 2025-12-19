import os

def delete_extra_labels(image_dir, label_dir, image_extension='.jpg'):
    # Traverse the directories for images and labels
    image_files = set(os.listdir(image_dir))
    label_files = set(os.listdir(label_dir))

    # List of labels to delete
    extra_labels = []

    for label in label_files:
        # Check if the label has a corresponding image
        image_name = os.path.splitext(label)[0] + image_extension  # Adjust image extension
        if image_name not in image_files:
            extra_labels.append(label)
            # Delete the extra label file
            os.remove(os.path.join(label_dir, label))
            print(f"Deleted extra label: {label}")

    if not extra_labels:
        print("No extra labels found.")
    else:
        print(f"Deleted {len(extra_labels)} extra label(s).")

def check_labels(image_dir, label_dir, image_extension='.jpg'):
    # Traverse the directories for images and labels
    image_files = set(os.listdir(image_dir))
    label_files = set(os.listdir(label_dir))

    # Ensure that every image has a corresponding label
    missing_labels = []
    extra_labels = []

    for image in image_files:
        # Check if the image has a corresponding label
        label_name = os.path.splitext(image)[0] + '.txt'
        if label_name not in label_files:
            missing_labels.append(image)

    for label in label_files:
        # Check if the label has a corresponding image
        image_name = os.path.splitext(label)[0] + image_extension  # Adjust image extension
        if image_name not in image_files:
            extra_labels.append(label)

    # Print out the results
    if not missing_labels and not extra_labels:
        print("All images have corresponding labels!")
    else:
        if missing_labels:
            print(f"Missing labels for the following images: {', '.join(missing_labels)}")
        if extra_labels:
            print(f"Extra label files without corresponding images: {', '.join(extra_labels)}")
            confirmation = input("Do you want to delete these extra labels? (yes/no): ")

            if confirmation.lower() == 'yes':
                for label in extra_labels:
                    os.remove(os.path.join(label_dir, label))  # Delete the extra label
                    print(f"Deleted extra label: {label}")
            else:
                print("No labels were deleted.")
        else:
            print("No extra labels found.")

# Directories where your images and labels are stored
image_dirs = [
    r'C:\Users\divyj\Desktop\hackathons\hackVeda iilm\model my\data\raw unfiltered\underwater_plastics\images\test',
    r'C:\Users\divyj\Desktop\hackathons\hackVeda iilm\model my\data\raw unfiltered\underwater_plastics\images\val',
    r'C:\Users\divyj\Desktop\hackathons\hackVeda iilm\model my\data\raw unfiltered\underwater_plastics\images\train'
]

label_dirs = [
    r'C:\Users\divyj\Desktop\hackathons\hackVeda iilm\model my\data\raw unfiltered\underwater_plastics\labels\test',
    r'C:\Users\divyj\Desktop\hackathons\hackVeda iilm\model my\data\raw unfiltered\underwater_plastics\labels\val',
    r'C:\Users\divyj\Desktop\hackathons\hackVeda iilm\model my\data\raw unfiltered\underwater_plastics\labels\train'
]

# Check each set of directories
for image_dir, label_dir in zip(image_dirs, label_dirs):
    print(f"Checking {image_dir} and {label_dir}...")
    check_labels(image_dir, label_dir)
    print()

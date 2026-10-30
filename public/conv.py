import cv2
import numpy as np
import imageio
import argparse
import sys

def remove_black_background(input_video_path, output_video_path, threshold_low=10, threshold_high=30):
    cap = cv2.VideoCapture(input_video_path)
    if not cap.isOpened():
        print(f"Error: Could not open video {input_video_path}")
        sys.exit(1)

    fps = cap.get(cv2.CAP_PROP_FPS)
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    
    print(f"Processing: {input_video_path} ({width}x{height} @ {fps} FPS)")

    # Initialize the imageio writer for WebM with alpha channel support
    writer = imageio.get_writer(
        output_video_path, 
        fps=fps, 
        codec='libvpx-vp9', 
        pixelformat='yuva420p'
    )

    frame_count = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        max_rgb = np.max(frame_rgb, axis=2)

        # Soft threshold for smooth edges
        alpha_mask = np.clip(
            (max_rgb - threshold_low) / (threshold_high - threshold_low) * 255, 
            0, 255
        ).astype(np.uint8)

        rgba_frame = np.dstack((frame_rgb, alpha_mask))
        writer.append_data(rgba_frame)
        
        frame_count += 1
        if frame_count % 30 == 0:
            print(f"Processed {frame_count} frames...")

    cap.release()
    writer.close()
    print(f"Done! Saved to: {output_video_path}")

if __name__ == "__main__":
    # Set up command-line argument parsing
    parser = argparse.ArgumentParser(description="Remove black background from a video and save as WebM with alpha.")
    parser.add_argument("input", help="Path to input video (e.g., intro.mp4)")
    parser.add_argument("output", help="Path to output video (e.g., intro.webm)")
    parser.add_argument("--low", type=int, default=10, help="Lower threshold for black (default: 10)")
    parser.add_argument("--high", type=int, default=30, help="Upper threshold for black (default: 30)")

    args = parser.parse_args()

    remove_black_background(args.input, args.output, args.low, args.high)
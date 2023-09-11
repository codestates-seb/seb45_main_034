package com.seb_main_034.SERVER.streaming.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.amazonaws.HttpMethod;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URL;

@Service
public class StreamingService {

    private AmazonS3 s3client = AmazonS3ClientBuilder.standard().build();

    public ResponseEntity<Resource> getVideoStream(String videoPath) {
        try {
            File videoFile = new File(videoPath);
            InputStreamResource resource = new InputStreamResource(new FileInputStream(videoFile));

            return ResponseEntity.ok()
                    .contentType(MediaType.valueOf("video/mp4"))
                    .body(resource);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    public String getStreamingUrl(String fileName) {
        GeneratePresignedUrlRequest generatePresignedUrlRequest =
                new GeneratePresignedUrlRequest("your-bucket-name", fileName);
        generatePresignedUrlRequest.setMethod(HttpMethod.GET);  // 이 부분이 수정된 HttpMethod를 사용합니다.
        URL url = s3client.generatePresignedUrl(generatePresignedUrlRequest);
        return url.toString();
    }
}




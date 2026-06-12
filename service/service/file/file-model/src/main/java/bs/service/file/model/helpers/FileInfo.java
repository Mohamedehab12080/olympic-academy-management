package bs.service.file.model.helpers;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "content")
public class FileInfo {
    private String originalFilename;
    private String extension;
    private Long size;
    private String contentType;
    private byte[] content;
}

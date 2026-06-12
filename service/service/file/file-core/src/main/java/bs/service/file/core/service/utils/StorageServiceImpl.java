package bs.service.file.core.service.utils;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import bs.lib.common.model.exception.BusinessException;
import bs.service.file.api.service.utils.StorageService;
import bs.service.file.model.enums.FileErrors;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
//
@RequiredArgsConstructor
public class StorageServiceImpl implements StorageService {

    @Override
    public void write(String folderBase, String fileName, byte[] file) {
        Path targetPath = Paths.get(folderBase, fileName);
        try (InputStream inputStream = new ByteArrayInputStream(file)) {
            if (!Files.exists(targetPath.getParent()))
                Files.createDirectories(targetPath.getParent());
            Files.copy(inputStream, targetPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new BusinessException(e, FileErrors.FILE_UPLOAD_FAILED);
        }
    }

    @Override
    public byte[] read(String completePath) {
        Path filePath = Paths.get(completePath);
        try {
            return Files.readAllBytes(filePath);
        } catch (IOException e) {
            throw new BusinessException(e, FileErrors.FILE_NOT_FOUND);
        }
    }

    @Override
    public void delete(String filePath) {
        Path path = Paths.get(filePath);
        try {
            if (Files.exists(path)) {
                Files.delete(path);
            } else {
                 throw new BusinessException(FileErrors.FILE_NOT_FOUND,filePath);
             }
        } catch (IOException e) {
            throw new BusinessException(e, FileErrors.FILE_DELETE_FAILED, filePath);
        }
    }
}

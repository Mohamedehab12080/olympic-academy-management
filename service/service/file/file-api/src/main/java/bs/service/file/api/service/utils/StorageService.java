package bs.service.file.api.service.utils;

public interface StorageService {

    void write(String folderBase, String fileName, byte[] file);
    byte[] read(String filePath);
    void delete(String filePath);
}

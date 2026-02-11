use fullstack;
SELECT * FROM Student 
ORDER BY VTU_Number ASC;
SELECT * FROM Student 
ORDER BY VTU_Number DESC;
SELECT * FROM Student 
ORDER BY VTU_Number DESC;
SELECT * FROM Student 
ORDER BY VTU_Number DESC;
SELECT * FROM Student 
ORDER BY VTU_Number DESC;
SELECT * FROM Student 
ORDER BY VTU_Number DESC;
SELECT 
    s.VTU_Number, 
    s.Name, 
    c.Course_Name
FROM Student s
LEFT JOIN Course c ON s.VTU_Number = c.Student_ID;
SELECT 
    s.VTU_Number, 
    s.Name, 
    c.Course_Name
FROM Student s
LEFT JOIN Course c ON s.VTU_Number = c.Student_ID;
SELECT 
    s.VTU_Number, 
    s.Name, 
    c.Course_Name
FROM Student s
LEFT JOIN Course c ON s.VTU_Number = c.Student_ID;
SELECT 
    s.VTU_Number, 
    s.Name, 
    c.Course_Name
FROM Student s
LEFT JOIN Course c ON s.VTU_Number = c.Student_ID;
SELECT 
    s.VTU_Number, 
    s.Name, 
    c.Course_Name
FROM Student s
LEFT JOIN Course c ON s.VTU_Number = c.Student_ID;

SELECT 
    s.VTU_Number, 
    s.Name, 
    c.Course_Name
FROM Student s
LEFT JOIN Course c ON s.VTU_Number = c.Student_ID;
SELECT s.Name, c.Course_Name
FROM Student s
CROSS JOIN Course c;




